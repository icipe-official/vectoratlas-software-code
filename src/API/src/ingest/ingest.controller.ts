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
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ValidationService } from 'src/validation/validation.service';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(
    private ingestService: IngestService,
    private validationService: ValidationService,
    private readonly mailerService: MailerService,
  ) {}

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
  ) {
    const userId = user.sub;
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

    const csvString = csv.buffer.toString();
    const validationErrors = await this.validationService.validateCsv(
      csvString,
      dataType,
    );
    if (validationErrors[0].length > 0) {
      throw new HttpException(
        'Validation error(s) found with uploaded data',
        500,
      );
    }

    if (dataSource === 'vector-atlas') {
      dataType === 'bionomics'
        ? await this.ingestService.saveBionomicsCsvToDb(
            csvString,
            userId,
            datasetId,
          )
        : await this.ingestService.saveOccurrenceCsvToDb(
            csvString,
            userId,
            datasetId,
          );
    }

    const requestHtml = `<div>
    <h2>Review Request</h2>
    <p>To review this upload, please visit http://www.vectoratlas.icipe.org/review/${datasetId}</p>
    </div>`;
    this.mailerService.sendMail({
      to: process.env.REVIEWER_EMAIL_LIST,
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
  ): StreamableFile {
    return res.download(
      `${process.cwd()}/public/templates/${source}/${type}.csv`,
    );
  }
}
