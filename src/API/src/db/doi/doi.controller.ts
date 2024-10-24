import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoiService } from './doi.service';
import { DOI } from './entities/doi.entity';

@Controller('doi')
export class DoiController {
  constructor(private readonly doiService: DoiService) {}

  @Post()
  create(@Body() doi: DOI) {
    return this.doiService.upsert(doi);
  }

  @Get()
  findAll() {
    return this.doiService.getDOIs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doiService.getDOI(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() doi: DOI) {
    return this.doiService.upsert(doi);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doiService.remove(id);
  }

  @Post(':id')
  async approveDOI(@Param('id') id: string) {
    const doi = await this.findOne(id);
    if (doi) {
      return await this.doiService.approveDOI(doi);
    }
  }

  @Post(':id')
  async rejectDOI(@Param('id') id: string) {
    const doi = await this.findOne(id);
    if (doi) {
      return await this.doiService.rejectDOI(doi);
    }
  }
}
