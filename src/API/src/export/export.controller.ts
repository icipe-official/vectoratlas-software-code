import { Controller, Get, Res, StreamableFile } from '@nestjs/common';

@Controller('export')
export class ExportController {
  @Get('download-all')
  getAllData(@Res() res): StreamableFile {
    const fileName = 'occurrenceDownloadFile.csv';
    return res.download(`${process.cwd()}/public/downloads/` + fileName);
  }
}
