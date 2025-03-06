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
import { AuthUser } from 'src/auth/user.decorator';

@Controller('uploaded-dataset-log')
export class UploadedDatasetLogController {
  constructor(
    private readonly uploadedDatasetLogService: UploadedDatasetLogService,
  ) {}

  @Post()
  async create(
    @AuthUser() user: any,
    @Body() uploadedDatasetLog: UploadedDatasetLog,
  ) {
    return await this.uploadedDatasetLogService.create(
      uploadedDatasetLog,
      user?.sub,
    );
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
    @AuthUser() user: any,
    @Param('id') id: string,
    @Body() uploadedDatasetLog: UploadedDatasetLog,
  ) {
    return await this.uploadedDatasetLogService.update(
      id,
      uploadedDatasetLog,
      user?.sub,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedDatasetLogService.remove(id);
  }
}
