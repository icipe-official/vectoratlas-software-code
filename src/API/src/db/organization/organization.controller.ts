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

import sharpImage from 'sharp';

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
      console.log('[organization/upload-logo] Sharp metadata:', metadata);
    } catch (error) {
      console.error('[organization/upload-logo] Sharp error:', error);
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

    const result = await this.azureBlobService.uploadOrganizationLogo(file);

    return {
      logoUrl: result.uploadedFileUrl,
      filePath: result.filePath,
    };
  }
}
