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
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { mapValidationIssues, transformHeaderRow } from 'src/utils';
import { ValidationService } from './validation.service';

@Controller('validation')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Uploader)
  @Post('validateUpload')
  @UseInterceptors(FileInterceptor('file'))
  async validateCsv(
    @UploadedFile() csv: Express.Multer.File,
    @Query('dataSource') dataSource: string,
    @Query('dataType') dataType: string,
  ) {
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

    let validationIssues = await this.validationService.validateCsv(
      csvString,
      dataType,
    );

    if (dataSource !== 'Vector Atlas') {
      validationIssues = mapValidationIssues(
        dataSource,
        dataType,
        validationIssues,
      );
    }

    return validationIssues;
  }
}
