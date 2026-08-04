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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');

@Controller('species-information')
export class SpeciesInformationController {
  constructor(
    private readonly speciesInformationService: SpeciesInformationService,
  ) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.mimetype !== 'image/jpeg') {
      throw new BadRequestException('Only JPEG images are supported');
    }

    const previewBuffer = await sharp(file.buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return {
      imageBase64: file.buffer.toString('base64'),
      previewBase64: previewBuffer.toString('base64'),
    };
  }

  @Get(':id/download-image')
  async downloadImage(@Param('id') id: string, @Res() res: Response) {
    const species =
      await this.speciesInformationService.getSpeciesImageForDownload(id);

    if (!species || !species.speciesImage) {
      throw new NotFoundException('Image not found');
    }

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${
        species.name || 'species'
      }.jpeg"`,
    });
    return res.send(species.speciesImage);
  }
}
