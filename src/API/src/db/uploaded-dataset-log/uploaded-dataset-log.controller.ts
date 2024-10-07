import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UploadedDatasetLogService } from './uploaded-dataset-log.service';
import { UploadedDatasetLog } from './entities/uploaded-dataset-log.entity';

@Controller('uploaded-dataset-log')
export class UploadedDatasetLogController {
  constructor(
    private readonly uploadedDatasetLogService: UploadedDatasetLogService,
  ) {}

  @Post()
  async create(@Body() uploadedDatasetLog: UploadedDatasetLog) {
    return await this.uploadedDatasetLogService.create(uploadedDatasetLog);
  }

  @Get()
  async getUploadedDatasetLogs() {
    return await this.uploadedDatasetLogService.getUploadDatasetLogs();
  }

  @Get(':id')
  async getUploadedDatasetLog(@Param('id') id: string) {
    return await this.uploadedDatasetLogService.getUploadDatasetLog(id);
  }

  @Get('dataset-logs')
  async getUploadedDatasetLogByDataset(@Param('datasetId') datasetId: string) {
    return await this.uploadedDatasetLogService.getUploadDatasetLogByDataset(
      datasetId,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() uploadedDatasetLog: UploadedDatasetLog,
  ) {
    return await this.uploadedDatasetLogService.update(id, uploadedDatasetLog);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedDatasetLogService.remove(id);
  }
}
