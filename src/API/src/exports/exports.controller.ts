import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateExportDto } from './dto/create-export.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as zlib from 'zlib';
import { AuthUser } from 'src/auth/user.decorator';
import { ExportsServiceV2 } from './exports.service-v2';

@Controller('exports')
export class ExportsController {
  private readonly logger = new Logger(ExportsController.name);

  constructor(private readonly exportsService: ExportsServiceV2) {}

  @Post()
  @UseInterceptors(FileInterceptor('idFile'))
  async createExport(
    @Body() dto: CreateExportDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    this.logger.log('Using exports worker v2');
    // unzip
    let ids = [];
    if (file) {
      const decompressed = zlib.gunzipSync(file?.buffer);
      ids = JSON.parse(decompressed.toString('utf-8'));
      this.logger.log(`Occurrence IDS Length: ${ids.length.toString()}`);
    }
    return this.exportsService.createExportJob(dto, null, ids);
  }

  @Get('download/:jobId')
  async downloadExport(
    @Param('jobId') jobId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Strip optional .zip suffix from the URL param
    const id = jobId.replace(/\.zip$/, '');
    return this.exportsService.streamDownload(id, req, res);
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
