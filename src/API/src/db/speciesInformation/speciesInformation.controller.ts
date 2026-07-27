import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { SpeciesInformationService } from './speciesInformation.service';

// CHANGED: TypeScript kept resolving sharp's type declarations as
// non-callable in this project's config, regardless of import style
// (`import sharp from`, `import * as sharp from`, and
// `import sharp = require(...)` all failed the same way). Plain
// require() sidesteps that entirely — sharp becomes typed as `any`
// and isn't type-checked at all, only used at runtime.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

@Controller('species-information')
export class SpeciesInformationController {
  constructor(
    private readonly azureBlobService: AzureBlobService,
    private readonly speciesInformationService: SpeciesInformationService,
  ) {}

  // Uploads a new species image. Two things happen here:
  // 1. The original JPEG is uploaded as-is (this becomes speciesImage).
  // 2. A smaller WebP copy is generated on the server and uploaded too
  //    (this becomes previewImage). The frontend never has to do any
  //    image conversion itself.
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Only JPEG is accepted, since that's the documented format and
    // the only one we're set up to convert to WebP here.
    if (file.mimetype !== 'image/jpeg') {
      throw new BadRequestException('Only JPEG images are supported');
    }

    // Step 1: upload the original JPEG, unchanged
    const originalResult = await this.azureBlobService.upload(
      file,
      'species-images',
    );

    // Step 2: build a smaller WebP version in memory.
    // - resize() caps the width so the preview is genuinely lighter
    // - withoutEnlargement stops small images being blown up
    // - webp({ quality: 80 }) is a solid size/quality balance
    const previewBuffer = await sharp(file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Step 3: upload that WebP buffer as its own file, in its own
    // container, so it's a completely separate object from the original
    const previewFile: Express.Multer.File = {
      ...file,
      buffer: previewBuffer,
      size: previewBuffer.length,
      mimetype: 'image/webp',
      originalname: file.originalname.replace(/\.jpe?g$/i, '.webp'),
    };
    const previewResult = await this.azureBlobService.upload(
      previewFile,
      'species-images-preview',
    );

    // Store only the bare filename (no directory prefix, no host/URL) so
    // it matches the format the rest of the species_information table
    // uses, and what the /images/:filename route expects when it looks
    // the file up under public/species-images/.
    const stripDirectory = (filePath: string) => filePath.split('/').pop();

    return {
      imageUrl: stripDirectory(originalResult.filePath),
      fileName: stripDirectory(originalResult.filePath),
      previewImageUrl: stripDirectory(previewResult.filePath),
      previewFileName: stripDirectory(previewResult.filePath),
    };
  }

  // On-demand download route. The list page never loads speciesImage,
  // so when someone clicks "Download" there, the frontend calls this
  // route with just the species id. We look up speciesImage here and
  // redirect the browser to the real file — either straight to Azure
  // (if it's already a full URL) or through our own local image route
  // (if it's just a bare filename sitting in the flat species-images
  // folder, as with the manually-populated legacy rows).
  @Get(':id/download-image')
  async downloadImage(@Param('id') id: string, @Res() res: Response) {
    const species =
      await this.speciesInformationService.getSpeciesImageForDownload(id);

    if (!species || !species.speciesImage) {
      throw new NotFoundException('Image not found');
    }

    const isFullUrl =
      species.speciesImage.startsWith('http://') ||
      species.speciesImage.startsWith('https://');

    const redirectTarget = isFullUrl
      ? species.speciesImage
      : `/vector-api/species-information/images/${species.speciesImage}`;

    return res.redirect(redirectTarget);
  }

  @Get('images/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'species-images', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }
    return res.sendFile(filePath);
  }
}
