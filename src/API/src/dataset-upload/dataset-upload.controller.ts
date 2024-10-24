import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { DatasetUploadService } from './dataset-upload.service';
import { ValidationService } from 'src/validation/validation.service';
import { AuthService } from 'src/auth/auth.service'; 
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/user.decorator';
import { transformHeaderRow } from 'src/utils';
import { uploadDataset } from './utils';
import config from 'src/config/config';
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as path from 'path';
import { UploadedDatasetService } from 'src/db/uploaded-dataset/uploaded-dataset.service';
import { UploadedDataset } from 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { ApprovalStatus } from 'src/commonTypes';
import { getCurrentUser } from 'src/db/doi/util';

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

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDay() + 1).padStart(2, '0');
  const h = String(date.getHours() + 1).padStart(2, '0');
  const m = String(date.getMinutes() + 1).padStart(2, '0');
  const s = String(date.getSeconds() + 1).padStart(2, '0');
  const ms = date.getMilliseconds();
  return `${y}${M}${d}${h}${m}${s}${ms}`;
};

@Controller('dataset-upload')
export class DatasetUploadController {
  constructor(
    private readonly datasetUploadService: DatasetUploadService,
    private readonly uploadedDatasetService: UploadedDatasetService,
    private validationService: ValidationService,
    private authService: AuthService, 
  ) {}

  dateToString(date: Date = new Date()) {
    return (
      date.getFullYear() +
      '' +
      date.getMonth() +
      '' +
      date.getDay() +
      '' +
      date.getHours() +
      '' +
      date.getMinutes() +
      '' +
      date.getSeconds() +
      '' +
      date.getMilliseconds()
    );
  }

  // @UseGuards(AuthGuard('va'), RolesGuard)
  // @Roles(Role.Uploader)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storageOptions)) // remove storage options when we go to production of when AZURE blobstorage connection string is available
  async uploadCsv(
    @UploadedFile() csv: Express.Multer.File,
    @AuthUser() user: any,
    @Query('dataSource') dataSource: string,
    @Query('dataType') dataType: string,
    @Query('title') title: string,
    @Query('description') description: string,
    @Query('country') country: string,
    @Query('region') region: string,
    @Query('datasetId') datasetId?: string,
    @Query('doi') doi?: string,
    @Query('generateDoi') generateDoi?: boolean,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (!(await this.datasetUploadService.validDataset(datasetId))) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (!(await this.datasetUploadService.validUser(datasetId, userId))) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      if (doi) {
        if (await this.datasetUploadService.doiExists(doi, datasetId)) {
          throw new HttpException(
            'A dataset already exists with this DOI.',
            500,
          );
        }
      }
      // const dataFolder = 'data-import/data/';
      // const parts: Array<string> = csv.originalname.split('.');
      // const fileName =
      //   parts[0] +
      //   this.dateToString() +
      //   (parts.length > 0 ? ('.' + parts[parts.length - 1]) : '');

      // const filePath = `${dataFolder}/${fileName}`;
      // fs.writeFileSync(filePath, csv.buffer);
      // const generatedDatasetId = this.ingestService.importViaPython(fileName, datasetId, doi, userId);
      // return await this.emailReviewers(generatedDatasetId);

      // const userId = user.sub;
      if (datasetId) {
        if (!(await this.datasetUploadService.validDataset(datasetId))) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (!(await this.datasetUploadService.validUser(datasetId, userId))) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      if (doi) {
        if (await this.datasetUploadService.doiExists(doi, datasetId)) {
          throw new HttpException(
            'A dataset already exists with this DOI.',
            500,
          );
        }
      }

      /* // Disable validation since we are allowing users to upload their own files for later formatting into VA_Template
      let csvString = csv.buffer.toString();

      if (dataSource !== 'Vector Atlas') {
        try {
          csvString = transformHeaderRow(csvString, dataSource, dataType);
        } catch (e) {
          throw new HttpException(
            'Could not transform this data for the given data source. Check the mapping file exists.',
            500,
          );
        }
      }

      const validationErrors = await this.validationService.validateCsv(
        csvString,
        dataType,
      );
      if (validationErrors.length > 0) {
        throw new HttpException(
          'Validation error(s) found with uploaded data - Please check the validation console',
          500,
        );
      }
      */
      // Upload data
      if (process.env.NODE_ENV == 'production') {
        // if we are in dev mode, just save file into drive
        await uploadDataset(csv);
      }
      // const newDatasetId =
      //   dataType === 'bionomics'
      //     ? await this.ingestService.saveBionomicsCsvToDb(
      //         csvString,
      //         userId,
      //         datasetId,
      //         doi,
      //       )
      //     : await this.ingestService.saveOccurrenceCsvToDb(
      //         csvString,
      //         userId,
      //         datasetId,
      //         doi,
      //       );
      //await this.emailReviewers(newDatasetId);
      const ds: UploadedDataset = new UploadedDataset();
      ds.title = title;
      ds.description = description;
      ds.uploaded_file_name = csv.filename;
      ds.provided_doi = doi;
      ds.last_upload_date = new Date();
      ds.status = ApprovalStatus.PENDING;
      ds.source_country = country;
      ds.source_region = region;
      ds.uploader_email = getCurrentUser();
      ds.is_doi_requested = generateDoi;
      await this.uploadedDatasetService.create(ds);
    } catch (e) {
      throw e;
    }
  }

  @Get('downloadTemplate')
  downloadTemplate(
    @Res() res,
    @Query('type') type: string,
    @Query('source') source: string,
  ): StreamableFile {
    return res.download(
      //`${config.get('publicFolder')}/public/templates/${source}/${type}.csv`,
      `${config.get(
        'publicFolder',
      )}/public/templates/${source}/va_template.csv`,
    );
  }
}
