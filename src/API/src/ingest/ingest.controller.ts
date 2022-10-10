import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  @Post('uploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBionomicsCsv(@UploadedFile() bionomicsCsv: Express.Multer.File) {
    await this.ingestService.saveBionomicsCsvToDb(
      bionomicsCsv.buffer.toString(),
    );
  }

  @Post('uploadOccurrence')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOccurrenceCsv(
    @UploadedFile() occurrenceCsv: Express.Multer.File,
  ) {
    await this.ingestService.saveOccurrenceCsvToDb(
      occurrenceCsv.buffer.toString(),
    );
  }
}
