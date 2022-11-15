import { Controller, Get, Query, Res, StreamableFile } from '@nestjs/common';
import { Float } from '@nestjs/graphql';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';

@Controller('export')
export class ExportController {
  constructor(private occurrenceService: OccurrenceService) {}

  @Get('downloadAll')
  getAllData(@Res() res): StreamableFile {
    return res.download(
      `${process.cwd()}/public/downloads/occurrenceDownloadFile.csv`,
    );
  }

  @Get('downloadFiltered')
  async getFilteredData(@Query() filters, @Res() res) {
    const take = 1;
    const skip = 0;
    console.log(filters);
    console.log(
      await this.occurrenceService.findOccurrences(
        take,
        skip,
        {
          ...filters,
          startTimestamp: parseFloat(filters.startTimestamp),
          endTimestamp: parseFloat(filters.endTimestamp),
        },
        false,
      ),
    );
  }
}
