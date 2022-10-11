import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('export')
export class ExportController {
  @Get('download-all')
  getAllOccurrenceData(@Res() res): StreamableFile {
    const fileName = 'downloadAllFile.csv';
    return res.download(`${process.cwd()}/public/downloads/` + fileName);
  }
}
