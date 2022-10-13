import { Inject, Injectable, Logger } from '@nestjs/common';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { createRepoCsv } from './utils/allDataCsvCreation';
const fs = require('fs');

@Injectable()
export class ExportService {
  constructor(
    @Inject(OccurrenceService)
    private readonly occurrenceService: OccurrenceService,
    private logger: Logger,
  ) {}

  async exportOccurrenceDbtoCsvFormat() {
    const dbData = await this.occurrenceService.findAll();
    try {
      return createRepoCsv('occurrence', dbData, null);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  exportCsvToDownloadsFile(csv: object, repo: string) {
    fs.writeFileSync(
      `${process.cwd()}/public/downloads/${repo}DownloadFile.csv`,
      csv.toString(),
    );
  }
}
