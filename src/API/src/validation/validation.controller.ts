import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationService } from './validation.service';

@Controller('validation')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  @Post('validateUploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  async validateBionomicsCsv(
    @UploadedFile() bionomicsCsv: Express.Multer.File,
  ) {
    const res = await this.validationService.validateBionomicsCsv(
      bionomicsCsv.buffer.toString(),
    );
    return res;
  }

  @Post('validateUploadOccurrence')
  @UseInterceptors(FileInterceptor('file'))
  async validateOccurrenceCsv(
    @UploadedFile() occurrenceCsv: Express.Multer.File,
  ) {
    const res = await this.validationService.validateOccurrenceCsv(
      occurrenceCsv.buffer.toString(),
    );
    return res;
  }
}
