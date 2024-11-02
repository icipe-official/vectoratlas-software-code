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
} from '@nestjs/common';
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
import path from 'path';
import { formatDate } from 'src/utils';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';

const storageOptions: MulterOptions = {
  storage: diskStorage({
    destination: '../../public/uploads',
    filename: function (req, file, cb) {
      cb(
        null,
        // file.fieldname + '-' + Date.now() + path.extname(file.originalname),
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
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.approve(id, comments);
  }

  @Post('review')
  async reviewDataset(
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.review(id, comments);
  }

  @Post('reject-raw')
  async rejectRawDataset(
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.rejectRawDataset(id, comments);
  }

  @Post('reject-reviewed')
  async rejectReviewedDataset(
    @Query('id') id: string,
    @Body('comments') comments: string,
  ) {
    return await this.uploadedDatasetService.rejectReviewedDataset(
      id,
      comments,
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Uploader)
  @Post('read')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file'))
  async readDataset(
    @Res() res,
    @AuthUser() user: any,
    @Query('datasetId') datasetId: string,
    // @Query('filename') fileName: string,
  ) {
    const userId = user?.sub;
    //const userId = user.sub;
    const dataset = await this.uploadedDatasetService.getUploadedDataset(
      datasetId,
    );
    if (!dataset) {
      throw new HttpException('No dataset exists with this id.', 500);
    }

    const file = await this.uploadedDatasetService.readFile(datasetId);
    return file.pipe(res);
    /*if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }  */
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadNew(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Body() uploadedDataset: UploadedDataset,
  ) {
    return await this.uploadedDatasetService.firstUpload(uploadedDataset, file);
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Uploader)
  @Post('reupload')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file', storageOptions))
  async reupload(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Query('datasetId') datasetId: string,
    @Body() uploadedDataset: UploadedDataset,
  ) {
    try {
      const userId = user?.sub;
      //const userId = user.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      // const fileName = file.filename;
      // const dataset = await this.uploadedDatasetService.getUploadedDataset(
      //   datasetId,
      // );

      // Upload data
      // if (process.env.NODE_ENV == 'production') {
      // if we are in dev mode, just save file into drive
      //fileName = await uploadDataset(csv);
      // }
      // dataset.uploaded_file_name = fileName;
      return await this.uploadedDatasetService.reUpload(
        datasetId,
        uploadedDataset,
        file,
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * Download raw dataset file
   */
  @Get('download-raw')
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
  @Get('download-converted')
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

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  // @Roles(Role.ReviewerManager)
  @Post('assign-primary-reviewer')
  async assignPrimaryReviewers(
    @Body('datasetId') datasetId: string,
    @Body('primaryReviewers') primaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.assignPrimaryReviewer(
      datasetId,
      primaryReviewers,
      comments,
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.ReviewerManager)
  @Post('assign-tertiary-reviewer')
  async assignTertiaryReviewers(
    @Body('datasetId') datasetId: string,
    @Body('tertiaryReviewers') tertiaryReviewers: string[],
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.assignTertiaryReviewer(
      datasetId,
      tertiaryReviewers,
      comments,
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  // @Roles(Role.ReviewerManager)
  @Post('reject-raw-dataset')
  async rejectRawDatasets(
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.rejectRawDataset(
      datasetId,
      comments,
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.ReviewerManager)
  @Post('reject-reviewed-dataset')
  async rejectReviewedDatasets(
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
  ) {
    return await this.uploadedDatasetService.rejectReviewedDataset(
      datasetId,
      comments,
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('complete-primary-review')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file' /*, storageOptions*/))
  async completePrimaryReview(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
    @Body('datasetId') datasetId?: string,
    @Body('comments') comments?: string,
    // @Body('otherRecipients') otherRecipients?: [string],
  ) {
    try {
      const userId = user?.sub;
      //const userId = user.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      // Upload data
      // if (process.env.NODE_ENV == 'production') {
      // if we are in dev mode, just save file into drive
      //fileName = await uploadDataset(csv);
      // }
      // const fileName = file.originalname;
      await this.uploadedDatasetService.completePrimaryReview(
        datasetId,
        file,
        comments,
        // otherRecipients,
      );
    } catch (e) {
      throw e;
    }
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('complete-tertiary-review')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file' /*, storageOptions*/))
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
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      // Upload data
      // if (process.env.NODE_ENV == 'production') {
      // if we are in dev mode, just save file into drive
      //fileName = await uploadDataset(csv);
      // }
      const fileName = file.originalname;
      await this.uploadedDatasetService.completeTertiaryReview(
        datasetId,
        file,
        comments,
      );
    } catch (e) {
      throw e;
    }
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.ReviewerManager)
  @Post('adhoc-communication')
  @UseInterceptors(FilesInterceptor('files'))
  async adhocCommunication(
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
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('validate')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file' /*, storageOptions*/))
  async validateDataset(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
  ) {
    try {
      return await this.uploadedDatasetService.validate(datasetId);
    } catch (e) {
      throw e;
    }
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('adhoc-validate')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file' /*, storageOptions*/))
  async adhocValidateDataset(
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
  ) {
    try {
      return await this.uploadedDatasetService.validate(null, file);
    } catch (e) {
      throw e;
    }
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('ingest')
  // remove storage options when we go to production of when AZURE blobstorage connection string is available
  @UseInterceptors(FileInterceptor('file' /*, storageOptions*/))
  async ingestDataset(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
  ) {
    try {
      return await this.uploadedDatasetService.ingest(datasetId);
    } catch (e) {
      throw e;
    }
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Reviewer)
  @Post('request-reupload')
  async requestReupload(
    @AuthUser() user: any,
    @Body('datasetId') datasetId: string,
    @Body('comments') comments?: string,
    @Body() all?,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (
          !(await this.uploadedDatasetService.getUploadedDataset(datasetId))
        ) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (
          !(await this.uploadedDatasetService.validdateUser(datasetId, userId))
        ) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }
      await this.uploadedDatasetService.requestReupload(datasetId, comments);
    } catch (e) {
      throw e;
    }
  }
}
