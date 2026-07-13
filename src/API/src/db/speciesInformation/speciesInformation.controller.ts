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

@Controller('species-information')
export class SpeciesInformationController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.azureBlobService.upload(file, 'species-images');

    return {
      imageUrl: result.uploadedFileUrl,
      fileName: result.filePath,
    };
  }

  @Get('images/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'species-images', filename);
    console.log('Looking for image at:', filePath); // TEMP DEBUG LINE

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Image not found');
    }

    return res.sendFile(filePath);
  }
}