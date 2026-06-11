import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateExportDto } from './dto/create-export.dto';
import { ExportsService } from './exports.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as zlib from 'zlib';

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('idFile'))
  async createExport(
    @Body() dto: CreateExportDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    // unzip
    const decompressed = zlib.gunzipSync(file.buffer);
    const ids = JSON.parse(decompressed.toString('utf-8'));

    return this.exportsService.createExportJob(dto, null, ids);
  }

  @Get(':jobId')
  async getExportStatus(@Param('jobId') jobId: string) {
    return this.exportsService.getExportStatus(jobId);
  }

  @Get(':jobId/download-link')
  async getDownloadLink(@Param('jobId') jobId: string) {
    return this.exportsService.getDownloadLink(jobId);
  }
}
