import { MailerService } from '@nestjs-modules/mailer';
import {
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  Res,
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
            'This user is not authorized to edit this dataset.',
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
            'Could not transform this data for the given data source.',
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
          'Validation error(s) found with uploaded data',
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
    <p>To review this upload, visit https://www.vectoratlas.icipe.org/review?dataset=${datasetId}</p>
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
    const extension = 'xlsx';
    const publicFolder = config.get('publicFolder');
    const filePath = path.join(
      publicFolder,
      'public/templates',
      source,
      `${type}.${extension}`,
    );

    return res.download(filePath, `${type}.${extension}`, (err) => {
      if (err) {
        this.logger.error(`Template not found at path: ${filePath}`);

        if (!res.headersSent) {
          res.status(404).json({
            statusCode: 404,
            message:
              `Template file not found: ${type}.${extension}. ` +
              `Please ensure the file exists and is in .xlsx format.`,
            error: 'Not Found',
          });
        }
      }
    });
  }
}