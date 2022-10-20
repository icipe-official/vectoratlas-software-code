import { Inject, Injectable, Logger } from '@nestjs/common';
import { OccurrenceService } from '../db/occurrence/occurrence.service';
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
    try {
      const csvString = occurrenceMapper(csvObject);
      fs.writeFile(
        `${process.cwd()}/public/downloads/${repo}DownloadFile.csv`,
        csvString,
        { encoding: 'utf8', flag: 'w' },
        (err) => {
          console.log(err);
        },
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
