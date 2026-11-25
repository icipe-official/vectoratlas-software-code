import {
  BadRequestException,
  Get,
  Param,
  StreamableFile,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';

import * as sharpModule from 'sharp';

const sharpImage = sharpModule as unknown as (
  input: Buffer,
) => import('sharp').Sharp;

@Controller('organization')
export class OrganizationController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Get('logo/:fileName')
  async getLogo(@Param('fileName') fileName: string): Promise<StreamableFile> {
    const result = await this.azureBlobService.downloadOrganizationLogo(
      fileName,
    );

    return new StreamableFile(result.stream, {
      type: result.contentType,
      disposition: 'inline',
    });
  }

  @Post('upload-logo')
  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Admin)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const allowedFormats = {
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    if (!Object.values(allowedFormats).includes(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG and WebP images are supported',
      );
    }

    console.log('[organization/upload-logo] Received file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferIsBuffer: Buffer.isBuffer(file.buffer),
      bufferLength: file.buffer?.length,
      bufferHeader: file.buffer?.subarray(0, 16).toString('hex'),
    });

    let metadata;

    try {
      metadata = await sharpImage(file.buffer).metadata();
    } catch (error) {
      console.error('[organization/upload-logo] Invalid image:', error);
      throw new BadRequestException('The uploaded file is not a valid image');
    }

    if (
      !metadata.format ||
      !allowedFormats[metadata.format] ||
      allowedFormats[metadata.format] !== file.mimetype
    ) {
      throw new BadRequestException(
        'The image content does not match its file type',
      );
    }

    const baseName = file.originalname.replace(/\.[^.]+$/, '') || 'logo';

    let normalizedBuffer: Buffer;

    try {
      const image = sharpImage(file.buffer).rotate().resize({
        width: 400,
        height: 200,
        fit: 'inside',
        withoutEnlargement: true,
      });

      switch (metadata.format) {
        case 'jpeg':
          normalizedBuffer = await image
            .jpeg({ quality: 85, mozjpeg: true })
            .toBuffer();
          break;

        case 'png':
          normalizedBuffer = await image
            .png({ compressionLevel: 9, palette: true })
            .toBuffer();
          break;

        case 'webp':
          normalizedBuffer = await image.webp({ quality: 85 }).toBuffer();
          break;

        default:
          throw new Error('Unsupported image format');
      }
    } catch (error) {
      console.error(
        '[organization/upload-logo] Image processing error:',
        error,
      );
      throw new BadRequestException('The image could not be processed');
    }

    const extension = metadata.format === 'jpeg' ? 'jpg' : metadata.format;

    // Pass the normalized image to Azure, with matching file details.
    file.buffer = normalizedBuffer;
    file.size = normalizedBuffer.length;
    file.mimetype = allowedFormats[metadata.format];
    file.originalname = `${baseName}.${extension}`;

    console.log('[organization/upload-logo] Image processed:', {
      format: metadata.format,
      size: file.size,
      filename: file.originalname,
    });

    const result = await this.azureBlobService.uploadOrganizationLogo(file);

    return {
      logoUrl: result.uploadedFileUrl,
      filePath: result.filePath,
    };
  }
}
