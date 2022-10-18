import { Controller, Get, Res, StreamableFile } from '@nestjs/common';

@Controller('export')
export class ExportController {
  @Get('downloadAll')
  getAllData(@Res() res): StreamableFile {
    return res.download(
      `${process.cwd()}/public/downloads/occurrenceDownloadFile.csv`,
    );
  }
}
