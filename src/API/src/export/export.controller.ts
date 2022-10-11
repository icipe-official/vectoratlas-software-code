import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';

@Controller('export')
export class ExportController {
  @Get('stream-all-file')
  getAll(): StreamableFile {
    const file = createReadStream(
      `${process.cwd()}/public/downloads/downloadAllFile.csv`,
    );
    return new StreamableFile(file);
  }
}
