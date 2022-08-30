import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  @Post('uploadBionomics')
  @UseInterceptors(FileInterceptor('file'))
  uploadBionomicsCsv(@UploadedFile() bionomicsCsv: Express.Multer.File) {
    this.ingestService.saveBionomicsCsvToDb(bionomicsCsv.buffer.toString());
  }
}
