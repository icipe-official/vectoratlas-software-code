import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { filter } from 'rxjs';
import { OccurrenceResolver } from 'src/db/occurrence/occurrence.resolver';
import { flattenOccurrenceRepoObject } from './utils/allDataCsvCreation';
import { convertToCSV } from './utils/convertToCsv';

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
