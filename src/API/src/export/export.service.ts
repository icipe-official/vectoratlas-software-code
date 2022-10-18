import { Inject, Injectable, Logger } from '@nestjs/common';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { flattenOccurrenceRepoObject } from './utils/allDataCsvCreation';
import { occurrenceMapper } from './utils/occurrenceMapper';
import * as fs from 'fs';

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
      const repoCsv = await flattenOccurrenceRepoObject(dbData);
      return repoCsv;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  exportCsvToDownloadsFile(csvObject: object, repo: string) {
    const csvString = occurrenceMapper(csvObject);
    fs.writeFileSync(
      `${process.cwd()}/public/downloads/${repo}DownloadFile.csv`,
      csvString,
    );
  }
}
