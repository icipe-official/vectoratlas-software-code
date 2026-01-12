import { MailerService } from '@nestjs-modules/mailer';
import {
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import { Logger } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import config from 'src/config/config';
import { transformHeaderRow } from 'src/utils';
import { ValidationService } from 'src/validation/validation.service';
import { IngestService } from './ingest.service';
import * as fs from 'fs';

@Controller('ingest')
export class IngestController {
  constructor(
    private ingestService: IngestService,
    private validationService: ValidationService,
    private authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
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

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() csv: Express.Multer.File,
    @AuthUser() user: any,
    @Query('dataSource') dataSource: string,
    @Query('dataType') dataType: string,
    @Query('datasetId') datasetId?: string,
    @Query('doi') doi?: string,
  ) {
    try {
      const userId = user?.sub;
      if (datasetId) {
        if (!(await this.ingestService.validDataset(datasetId))) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (!(await this.ingestService.validUser(datasetId, userId))) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      if (doi) {
        if (await this.ingestService.doiExists(doi, datasetId)) {
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
        if (!(await this.ingestService.validDataset(datasetId))) {
          throw new HttpException('No dataset exists with this id.', 500);
        }
        if (!(await this.ingestService.validUser(datasetId, userId))) {
          throw new HttpException(
            'This user is not authorized to edit this dataset - it must be the original uploader.',
            500,
          );
        }
      }

      if (doi) {
        if (await this.ingestService.doiExists(doi, datasetId)) {
          throw new HttpException(
            'A dataset already exists with this DOI.',
            500,
          );
        }
      }

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

      const newDatasetId =
        dataType === 'bionomics'
          ? await this.ingestService.saveBionomicsCsvToDb(
              csvString,
              userId,
              datasetId,
              doi,
            )
          : await this.ingestService.saveOccurrenceCsvToDb(
              csvString,
              userId,
              datasetId,
              doi,
            );

      await this.emailReviewers(newDatasetId);
    } catch (e) {
      throw e;
    }
  }

  private async emailReviewers(datasetId: string) {
    await this.authService.init();
    const reviewerEmails = await this.authService.getRoleEmails('reviewer');
    const requestHtml = `<div>
    <h2>Review Request</h2>
    <p>To review this upload, please visit https://www.vectoratlas.icipe.org/review?dataset=${datasetId}</p>
    </div>`;
    await this.mailerService.sendMail({
      to: reviewerEmails,
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Review request',
      html: requestHtml,
    });
  }
 @Get('downloadTemplate')
  downloadTemplate(
    @Res() res,
    @Query('type') type: string,
    @Query('source') source: string,
  ) {
    // 1. Logic for extension: .xlsx for the new template, .csv for others
    const extension = type === 'vaTemplate2025' ? 'xlsx' : 'csv';

    // 2. Safely construct the path
    const publicFolder = config.get('publicFolder');
    const filePath = path.join(
      publicFolder, 
      'public/templates', 
      source, 
      `${type}.${extension}`
    );

    // 3. Execute the download
    return res.download(filePath, `${type}.${extension}`, (err) => {
      if (err) {
        this.logger.error(`Template not found: ${filePath}`);
        
        if (!res.headersSent) {
          res.status(404).json({
            statusCode: 404,
            message: `Template file not found: ${type}.${extension}`,
            error: 'Not Found',
          });
        }
      }
    });
  }
}