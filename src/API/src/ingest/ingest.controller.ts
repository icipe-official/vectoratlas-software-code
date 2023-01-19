import {
  Controller,
  HttpException,
  Post,
  Query,
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
  ) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('uploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBionomicsCsv(
    @UploadedFile() bionomicsCsv: Express.Multer.File,
    @AuthUser() user: any,
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

    const csvString = bionomicsCsv.buffer.toString();
    const validationErrors = await this.validationService.validateBionomicsCsv(
      csvString,
    );
    if (validationErrors[0].length > 0) {
      console.log(validationErrors);
      throw new HttpException(
        'Validation error(s) found with uploaded data',
        500,
      );
    }

    await this.ingestService.saveBionomicsCsvToDb(csvString, userId, datasetId);
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('uploadOccurrence')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOccurrenceCsv(
    @UploadedFile() occurrenceCsv: Express.Multer.File,
    @AuthUser() user: any,
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

    const csvString = occurrenceCsv.buffer.toString();
    const validationErrors = await this.validationService.validateOccurrenceCsv(
      csvString,
    );
    if (validationErrors[0].length > 0) {
      console.log(validationErrors);
      throw new HttpException(
        'Validation error(s) found with uploaded data',
        500,
      );
    }
    await this.ingestService.saveOccurrenceCsvToDb(
      occurrenceCsv.buffer.toString(),
      userId,
      datasetId,
    );
  }
}
