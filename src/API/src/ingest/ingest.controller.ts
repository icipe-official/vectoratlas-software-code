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
  Logger,
} from '@nestjs/common';
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
import * as path from 'path';

@Controller('ingest')
export class IngestController {
  private readonly logger = new Logger(IngestController.name);

  constructor(
    private ingestService: IngestService,
    private validationService: ValidationService,
    private authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
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

      if (doi && (await this.ingestService.doiExists(doi, datasetId))) {
        throw new HttpException('A dataset already exists with this DOI.', 500);
      }

      let fileString = file.buffer.toString();

      if (dataSource !== 'Vector Atlas') {
        fileString = transformHeaderRow(fileString, dataSource, dataType);
      }

      const validationErrors = await this.validationService.validateCsv(
        fileString,
        dataType,
      );

      if (validationErrors.length > 0) {
        throw new HttpException(
          'Validation errors found. Check validation console.',
          500,
        );
      }

      const newDatasetId =
        dataType === 'bionomics'
          ? await this.ingestService.saveBionomicsCsvToDb(
              fileString,
              userId,
              datasetId,
              doi,
            )
          : await this.ingestService.saveOccurrenceCsvToDb(
              fileString,
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

    await this.mailerService.sendMail({
      to: reviewerEmails,
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Review request',
      html: `<p>Please review dataset: ${datasetId}</p>`,
    });
  }

  @Get('downloadTemplate')
  downloadTemplate(
    @Res() res,
    @Query('type') type: string,
    @Query('source') source: string,
  ) {
    const extension = 'xlsx'; // ✅ All templates are now Excel

    const filePath = path.join(
      config.get('dataTemplatesFolder'),
      source,
      `${type}.xlsx`,
    );

    return res.download(filePath, `${type}.${extension}`, (err) => {
      if (err) {
        this.logger.error(`Template not found: ${filePath}`);
        if (!res.headersSent) {
          res.status(404).json({
            statusCode: 404,
            message: `Template not found: ${type}.${extension}`,
          });
        }
      }
    });
  }
}
