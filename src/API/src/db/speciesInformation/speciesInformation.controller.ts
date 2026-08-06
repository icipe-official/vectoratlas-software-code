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
    private readonly speciesInformationService: SpeciesInformationService,
  ) {}

  // Processes a newly-selected species image. No external storage upload
  // happens here anymore — this validates the file, generates a smaller
  // WebP preview, and returns both as base64 strings. The frontend holds
  // these in local state and sends them along with the rest of the form
  // in the createEditSpeciesInformation mutation, where they get decoded
  // to raw bytes and saved directly into the species_information table's
  // speciesImage / previewImage columns.
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

    // Build a smaller WebP version in memory.
    // - resize() caps the width so the preview is genuinely lighter
    // - withoutEnlargement stops small images being blown up
    // - webp({ quality: 80 }) is a solid size/quality balance
    const previewBuffer = await sharp(file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return {
      imageBase64: file.buffer.toString('base64'),
      previewBase64: previewBuffer.toString('base64'),
    };
  }

  // Download route for the list page's "Download" button. Reads the raw
  // bytes straight from Postgres and sends them back as a file attachment
  // — no redirect anywhere, since there's no external file to redirect to.
  @Get(':id/download-image')
  async downloadImage(@Param('id') id: string, @Res() res: Response) {
    const species =
      await this.speciesInformationService.getSpeciesImageForDownload(id);

    if (!species || !species.speciesImage) {
      throw new NotFoundException('Image not found');
    }

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${species.name || 'species'}.jpeg"`,
    });
    return res.send(species.speciesImage);
  }
}