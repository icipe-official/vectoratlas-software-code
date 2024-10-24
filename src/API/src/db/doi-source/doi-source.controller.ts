import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoiSourceService } from './doi-source.service'; 
import { DoiSource } from './entities/doi-source.entity';

@Controller('doi-source')
export class DoiSourceController {
  constructor(private readonly doiSourceService: DoiSourceService) {}

  @Post()
  create(@Body() createDoiSourceDto: DoiSource) {
    return this.doiSourceService.create(createDoiSourceDto);
  }

  @Get()
  findAll() {
    return this.doiSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doiSourceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoiSourceDto: DoiSource) {
    return this.doiSourceService.update(+id, updateDoiSourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doiSourceService.remove(+id);
  }
}
