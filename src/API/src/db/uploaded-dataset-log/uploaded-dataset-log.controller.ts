import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UploadedDatasetLogService } from './uploaded-dataset-log.service';
import { UploadedDatasetLog } from './entities/uploaded-dataset-log.entity';

@Controller('uploaded-dataset-log')
export class UploadedDatasetLogController {
  constructor(
    private readonly uploadedDatasetLogService: UploadedDatasetLogService,
  ) {}

  @Post()
  create(@Body() uploadedDatasetLog: UploadedDatasetLog) {
    return this.uploadedDatasetLogService.create(uploadedDatasetLog);
  }

  @Get()
  findAll() {
    return this.uploadedDatasetLogService.getUploadDatasetLogs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadedDatasetLogService.getUploadDatasetLog(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() uploadedDatasetLog: UploadedDatasetLog,
  ) {
    return this.uploadedDatasetLogService.update(id, uploadedDatasetLog);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadedDatasetLogService.remove(id);
  }
}
