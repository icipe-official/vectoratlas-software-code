import { Controller, Get, Inject, Res, StreamableFile } from '@nestjs/common';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';

@Controller('export')
export class ExportController {
  constructor(
    @Inject(OccurrenceService)
    private readonly occurrenceService: OccurrenceService,
  ) {}

  @Get('downloadAll')
  async getAllData(@Res() res): Promise<StreamableFile> {
    await this.occurrenceService.incrementAllDownload();
    return res.download(
      `${process.cwd()}/public/downloads/occurrenceDownloadFile.csv`,
    );
  }
}
