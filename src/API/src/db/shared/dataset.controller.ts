// src/dataset/dataset.controller.ts
import {
  Controller,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Get,
  Param,
  Res,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { DatasetService } from './dataset.service';
import { Response } from 'express';

@Controller('dataset')
export class DatasetController {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly logger: Logger,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDataset(
    @UploadedFile() file: Express.Multer.File,
    @Body('datasetId') datasetId: string,
    @Body('dataType') dataType: string,
    @Body('dataSource') dataSource: string,
    @Body('doi') doi: string,
    @Body('description') description: string,
    @Body('title') title: string,
    @Body('location') location: string,
    @Body('createdBy') createdBy: string,
    @Body('region') region: string,
  ) {
    return this.datasetService.uploadFile(
      file,
      datasetId,
      dataType,
      dataSource,
      doi,
      description,
      title,
      location,
      createdBy,
      region,
    );
  }

  @Get('/:datasetid')
  async getDatasetById(@Param('datasetid') id: string, @Res() res: Response) {
    try {
      const data = await this.datasetService.findOneById(id);
      if (!data) {
        res.status(404).send('Dataset not found');
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      this.logger.error('Failed to retrieve dataset.');
      throw new HttpException('Failed to retrieve dataset.', 500);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Admin)
  async deleteDataset(@Param('id') id: string) {
    return await this.datasetService.deleteDatasetData(id);
  }
}
