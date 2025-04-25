import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UploadedModelLogService } from './uploaded-model-log.service';

@Controller('model-log')
export class UploadedModelLogController {
  constructor(private readonly modelLogService: UploadedModelLogService) {}

  // @Post()
  // create(@Body() createUploadedModelLogDto: CreateUploadedModelLogDto) {
  //   return this.modelLogService.create(createUploadedModelLogDto);
  // }

  // @Get()
  // findAll() {
  //   return this.modelLogService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.modelLogService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUploadedModelLogDto: UpdateUploadedModelLogDto,
  // ) {
  //   return this.modelLogService.update(+id, updateUploadedModelLogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.modelLogService.remove(+id);
  // }
}
