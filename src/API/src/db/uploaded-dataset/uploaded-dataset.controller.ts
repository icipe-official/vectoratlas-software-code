import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDataset } from './entities/uploaded-dataset.entity';

@Controller('uploaded-dataset')
export class UploadedDatasetController {
  constructor(
    private readonly uploadedDatasetService: UploadedDatasetService,
  ) {}

  @Post()
  async create(@Body() uploadedDataset: UploadedDataset) {
    return this.uploadedDatasetService.create(uploadedDataset);
  }

  @Get()
  async findAll() {
    return this.uploadedDatasetService.getUploadedDatasets();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.uploadedDatasetService.getUploadedDataset(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() uploadedDataset: UploadedDataset,
  ) {
    return this.uploadedDatasetService.update(id, uploadedDataset);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.uploadedDatasetService.remove(id);
  }
}
