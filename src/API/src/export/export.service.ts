import { Inject, Injectable, Logger } from '@nestjs/common';
import { OccurrenceService } from '../db/occurrence/occurrence.service';
import { flattenOccurrenceRepoObject } from './utils/allDataCsvCreation';
import { convertToCSV } from './utils/convertToCsv';
import * as fs from 'fs';

@Injectable()
export class ExportService {
  constructor(
    @Inject(OccurrenceService)
    private readonly occurrenceService: OccurrenceService,
    private logger: Logger,
  ) {}

  async exportOccurrenceDbtoCsvFormat() {
    try {
      const dbData = await this.occurrenceService.findAll();
      const repoCsv = await flattenOccurrenceRepoObject(dbData);
      return repoCsv;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async exportCsvToDownloadsFile(csvObject: object, repo: string) {
    if (!fs.existsSync(`${process.cwd()}/public/downloads/`)) {
      fs.mkdirSync(`${process.cwd()}/public/downloads`);
    }

    const csvString = convertToCSV(csvObject);
    fs.writeFileSync(
      `${process.cwd()}/public/downloads/${repo}DownloadFile.csv`,
      csvString,
    );
  }
}
