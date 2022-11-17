import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { OccurrenceResolver } from 'src/db/occurrence/occurrence.resolver';

@Controller('export')
export class ExportController {
  constructor(private occurrenceResolver: OccurrenceResolver) {}

  async callOccurrence(take: number, skip: number, filters: any) {
    return await this.occurrenceResolver.OccurrenceData(
      { take: take, skip: skip },
      {
        ...filters,
        startTimestamp: parseFloat(filters.startTimestamp),
        endTimestamp: parseFloat(filters.endTimestamp),
      },
    );
  }

  @Get('downloadAll')
  getAllData(@Res() res): StreamableFile {
    return res.download(
      `${process.cwd()}/public/downloads/occurrenceDownloadFile.csv`,
    );
  }
}
