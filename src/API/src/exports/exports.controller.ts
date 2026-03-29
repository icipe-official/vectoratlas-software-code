import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExportDto } from './dto/create-export.dto';
import { ExportsService } from './exports.service';

@Controller('exports')
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) { }

  @Post()
  async createExport(@Body() dto: CreateExportDto) {
    return this.exportsService.createExportJob(dto);
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
