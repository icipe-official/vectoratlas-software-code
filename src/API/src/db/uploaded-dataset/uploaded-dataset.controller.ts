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
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UploadedFiles,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import config from 'src/config/config';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/user.decorator';
import { diskStorage } from 'multer';
import * as path from 'path';
import { formatDate } from 'src/utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { createReadStream } from 'fs';

const FILE_STORAGE_TYPE = process.env.FILE_STORAGE_TYPE; // one of AZURE or LOCAL

const storageOptions: MulterOptions = {
  storage: diskStorage({
    // destination: '../public/uploads',
    destination: `${config.get('publicFolder')}/public/uploads`,
    //`${config.get('publicFolder')}/public/uploads/${fileName}`,
    filename: function (req, file, cb) {
      cb(
        null,
        path.parse(file.originalname).name +
          '-' +
          formatDate(new Date()) +
          path.parse(file.originalname).ext,
      );
    },
  }),
};

@Controller('uploaded-dataset')
export class UploadedDatasetController {
  constructor(
    private readonly uploadedDatasetService: UploadedDatasetService,
    private readonly logger: Logger,
  ) {}

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
    @AuthUser() user: any,
    @Param('id') id: string,
    @Body() uploadedDataset: UploadedDataset,
  ) {
    return await this.uploadedDatasetService.update(
      id,
      uploadedDataset,
      user?.sub,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.uploadedDatasetService.remove(id);
  }

  @Post('approve')
  async approveRawDataset(
    @AuthUser() user: any,
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.approve(id, comments, user?.sub);
  }

  @Post('review')
  async reviewDataset(
    @AuthUser() user: any,
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.review(id, comments, user?.sub);
  }

  @Post('reject-raw')
  async rejectRawDataset(
    @AuthUser() user: any,
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.rejectRawDataset(
      id,
      comments,
      user?.sub,
    );
  }

  @Post('reject-reviewed')
  async rejectReviewedDataset(
    @AuthUser() user: any,
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    const userId = user?.sub;
    return await this.uploadedDatasetService.rejectReviewedDataset(
      id,
      comments,
      userId,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Uploader)
  @Post('read')
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Azure'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  // async readDataset(
  //   @Res() res,
  //   @AuthUser() user: any,
  //   @Query('datasetId') datasetId: string,
  //   // @Query('filename') fileName: string,
  // ) {
  //   const userId = user?.sub;
  //   //const userId = user.sub;
  //   const dataset = await this.uploadedDatasetService.getUploadedDataset(
  //     datasetId,
  //   );
  //   if (!dataset) {
  //     this.logger.error('No dataset exists with this id.');
  //     throw new HttpException('No dataset exists with this id.', 500);
  //   }

  //   const file = await this.uploadedDatasetService.readFile(datasetId);
  //   return file.pipe(res);
  //   /*if (
  //         !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
  //       ) {
  //         throw new HttpException(
  //           'This user is not authorized to edit this dataset - it must be the original uploader.',
  //           500,
  //         );
  //       }  */
  // }
  @Post('upload')
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Azure'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async uploadNew(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Body('data') data: string,
  ) {
    const ds = new UploadedDataset();
    Object.assign(ds, JSON.parse(data));
    return await this.uploadedDatasetService.firstUpload(ds, file, user?.sub);
  }

  /**
   * Download raw dataset file
   */
  @Get('/download-raw/:id')
  async downloadRawFile(
    @Res() res,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const fileName = (await this.findOne(id)).uploaded_file_name;
    // fileName = fileName.replace(
    //   `${config.get('publicFolder')}/public/uploads/`,
    //   '',
    // );
    if (fileName.startsWith('http')) {
      // fileName = 'http://212.183.159.230/5MB.zip';
      const fName = fileName.split('/').pop();
      const response = await axios.get(fileName, { responseType: 'stream' });
      res.setHeader('Content-Disposition', `attachment; filename="${fName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      response.data.pipe(res);
      return res;
    } else {
      const fName = fileName.split('/').pop();
      return res.download(
        `${fileName}`,
        fName,
        // `${config.get('publicFolder')}/public/uploads/${fileName}`,
      );
    }
  }

  /**
   * Download converted dataset file
   */
  // @Get('download-converted')
  // async downloadConvertedFile(
  //   @Res() res,
  //   @Query('id') id: string,
  // ): Promise<StreamableFile> {
  //   const fileName = (await this.findOne(id)).converted_file_name;
  //   if (fileName) {
  //     return res.download(
  //       `${config.get('publicFolder')}/public/uploads/${fileName}`,
  //     );
  //   } else {
  //     this.logger.error('The dataset has not been approved yet');
  //     throw 'The dataset has not been approved yet.';
  //   }
  // }

  /**
   * Download converted dataset file
   */
  @Get('/download-primary-approved/:id')
  async downloadPrimaryApprovedFile(
    @Res() res,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const fileName = (await this.findOne(id))
      .uploaded_file_name_primary_reviewed;
    if (fileName) {
      return res.download(
        `${config.get('publicFolder')}/public/uploads/${fileName}`,
      );
    } else {
      this.logger.error('The dataset has not been reviewed yet');
      throw 'The dataset has not been reviewed yet.';
    }
  }

  /**
   * Download converted dataset file
   */
  @Get('/download-tertiary-approved/:id')
  async downloadTertiaryApprovedFile(
    @Res() res,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    const fileName = (await this.findOne(id))
      .uploaded_file_name_tertiary_reviewed;
    if (fileName) {
      return res.download(
        `${config.get('publicFolder')}/public/uploads/${fileName}`,
      );
    } else {
      this.logger.error('The dataset is pending tertiary review');
      throw 'The dataset is pending tertiary review';
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  ////@Roles(Role.ReviewerManager)
  @Post('assign-primary-reviewer')
  async assignPrimaryReviewers(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('primaryReviewers') primaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    const userId = user?.sub;
    return await this.uploadedDatasetService.assignPrimaryReviewer(
      datasetId,
      primaryReviewers,
      comments,
      userId,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.ReviewerManager)
  @Post('assign-tertiary-reviewer')
  async assignTertiaryReviewers(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('tertiaryReviewers') tertiaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    const userId = user?.sub;
    return await this.uploadedDatasetService.assignTertiaryReviewer(
      datasetId,
      tertiaryReviewers,
      comments,
      userId,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  ////@Roles(Role.ReviewerManager)
  @Post('reject-raw-dataset')
  async rejectRawDatasets(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
  ) {
    const userId = user?.sub;
    return await this.uploadedDatasetService.rejectRawDataset(
      datasetId,
      comments,
      user?.sub,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.ReviewerManager)
  @Post('reject-reviewed-dataset')
  async rejectReviewedDatasets(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
  ) {
    const userId = user?.sub;
    return await this.uploadedDatasetService.rejectReviewedDataset(
      datasetId,
      comments,
      userId,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('complete-primary-review')
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Azure'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async completePrimaryReview(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Body('datasetId') datasetId?: string,
    @Body('comments') comments?: string,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          this.logger.error('No dataset exists with this id');
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          this.logger.error(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
          );
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }
      await this.uploadedDatasetService.completePrimaryReview(
        datasetId,
        file,
        comments,
        userId,
        // otherRecipients,
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('complete-tertiary-review')
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Azure'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async completeTertiaryReview(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Body('datasetId') datasetId?: string,
    @Body('comments') comments?: string,
  ) {
    try {
      const userId = user?.sub;
      //const userId = user.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          this.logger.error('No dataset exists with this id.');
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          this.logger.error(
            'This user is not authorized to edit this dataset - it must be the original uploader',
          );
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }
      await this.uploadedDatasetService.completeTertiaryReview(
        datasetId,
        file,
        comments,
        userId,
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.ReviewerManager)
  @Post('adhoc-communication')
  @UseInterceptors(FilesInterceptor('files'))
  async adhocCommunication(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('message') message: string,
    @Body('recipients') recipients: string | string[],
    @UploadedFiles() files: Express.Multer.File | Express.Multer.File[], // Handles file upload
  ) {
    if (typeof recipients == 'string') {
      recipients = recipients.split(',');
    }
    return await this.uploadedDatasetService.sendAdhocCommunication(
      datasetId,
      message,
      recipients,
      files,
      user?.sub,
    );
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('validate')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Local'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async validateDataset(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
  ) {
    try {
      return await this.uploadedDatasetService.validate(datasetId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('adhoc-validate')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Local'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async adhocValidateDataset(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
  ) {
    try {
      return await this.uploadedDatasetService.validate(null, file);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('ingest')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Local'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async ingestDataset(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
  ) {
    try {
      return await this.uploadedDatasetService.ingest(datasetId);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Reviewer)
  @Post('request-reupload')
  async requestReupload(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          this.logger.error('No dataset exists with this id.');
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          this.logger.error(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
          );
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }
      await this.uploadedDatasetService.requestReupload(
        datasetId,
        comments,
        userId,
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  ////@UseGuards(AuthGuard('va'), RolesGuard)
  ////@Roles(Role.Uploader)
  @Post('reupload-dataset')
  @UseInterceptors(
    FILE_STORAGE_TYPE === 'Local'
      ? FileInterceptor('file')
      : FileInterceptor('file', storageOptions),
  )
  async reuploadDataset(
    @AuthUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('datasetId') datasetId?: string,
    @Body('comments') comments?: string,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          this.logger.error('No dataset exists with this id.');
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          this.logger.error(
            'This user is not authorized to edit this dataset - it must be the original uploader',
          );
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }
      await this.uploadedDatasetService.reUpload(
        datasetId,
        file,
        comments,
        userId,
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
