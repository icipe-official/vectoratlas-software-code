import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UploadedModelService } from './uploaded-model.service';
import { UploadedModel } from './entities/uploaded-model.entity';
import { AuthUser } from 'src/auth/user.decorator';

@Controller('uploaded-model')
export class UploadedModelController {
  constructor(private readonly uploadedModelService: UploadedModelService) {}

  @Get()
  async findAll() {
    return await this.uploadedModelService.getUploadedModels();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.uploadedModelService.getUploadedModel(id);
  }

  @Patch(':id')
  async update(
    @AuthUser() user: any,
    @Param('id') id: string,
    @Body() uploadedModel: UploadedModel,
  ) {
    return await this.uploadedModelService.update(id, uploadedModel, user?.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedModelService.remove(id);
  }
}
