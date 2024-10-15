import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import config from 'src/config/config';

@Controller('uploaded-dataset')
export class UploadedDatasetController {
  constructor(
    private readonly uploadedDatasetService: UploadedDatasetService,
  ) {}

  @Post()
  async create(@Body() uploadedDataset: UploadedDataset) {
    return await this.uploadedDatasetService.create(uploadedDataset);
  }

  @Get()
  async findAll() {
    return await this.uploadedDatasetService.getUploadedDatasets();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.uploadedDatasetService.getUploadedDataset(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() uploadedDataset: UploadedDataset,
  ) {
    return await this.uploadedDatasetService.update(id, uploadedDataset);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedDatasetService.remove(id);
  }

  @Post('approve')
  async approveRawDataset(
    @Query('id') id: string,
    @Body('comment') comment: string,
  ) {
    return await this.uploadedDatasetService.approve(id, comment);
  }

  @Post('review')
  async reviewDataset(
    @Query('id') id: string,
    @Body('comment') comment: string,
  ) {
    return await this.uploadedDatasetService.review(id, comment);
  }

  @Post('reject-raw')
  async rejectRawDataset(
    @Query('id') id: string,
    @Body('comment') comment: string,
  ) {
    return await this.uploadedDatasetService.rejectRawDataset(id, comment);
  }

  @Post('reject-reviewed')
  async rejectReviewedDataset(
    @Query('id') id: string,
    @Body('comment') comment: string,
  ) {
    return await this.uploadedDatasetService.rejectReviewedDataset(id, comment);
  }

  /**
   * Download raw dataset file
   */
  @Get('downloadRaw')
  async downloadRawFile(
    @Res() res,
    @Query('id') id: string,
  ): Promise<StreamableFile> {
    const fileName = (await this.findOne(id)).uploaded_file_name;
    return res.download(
      `${config.get('publicFolder')}/public/uploads/${fileName}`,
    );
  }

  /**
   * Download converted dataset file
   */
  @Get('downloadConverted')
  async downloadConvertedFile(
    @Res() res,
    @Query('id') id: string,
  ): Promise<StreamableFile> {
    const fileName = (await this.findOne(id)).converted_file_name;
    if (fileName) {
      return res.download(
        `${config.get('publicFolder')}/public/uploads/${fileName}`,
      );
    } else {
      throw 'The dataset has not been approved yet.';
    }
  }

  @Post('assign-primary-reviewer')
  async assignPrimaryReviewers(
    @Body('datasetId') datasetId: string,
    @Body('primaryReviewers') primaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.assignPrimaryReviewer(datasetId, primaryReviewers, comments);
  }

  @Post('assign-tertiary-reviewer')
  async assignTertiaryReviewers(
    @Body('datasetId') datasetId: string,
    @Body('tertiaryReviewers') tertiaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.assignTertiaryReviewer(datasetId, tertiaryReviewers, comments);
  }
  
}
