// import fs from 'fs'; <===== Requires investigation
const fs = require('fs');
import { Inject, Injectable } from '@nestjs/common';
import { ExportService } from '../export.service';

interface LastIngest {
  ingestion: {
    ingestTime: string;
    isLocked: boolean;
  };
}

@Injectable()
export class AllDataFileBuilder {
  private lastIngestTime: LastIngest;
  constructor(
    @Inject(ExportService)
    private readonly exportService: ExportService,
  ) {
    this.lastIngestTime = JSON.parse(
      fs.readFileSync(process.cwd() + '/../../lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  async exportAllDataToCsvFile() {
    await this.exportService.exportOccurrenceDbtoCsvFormat();
  }

  async lastIngestWatch() {
    const currentIngestTime: LastIngest = JSON.parse(
      fs.readFileSync(process.cwd() + '/../../lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
    if (
      this.lastIngestTime !== null &&
      currentIngestTime.ingestion.ingestTime ===
        this.lastIngestTime.ingestion.ingestTime
    ) {
      console.log('No new ingest');
      return;
    } else {
      const csvOccurrence: any =
        await this.exportService.exportOccurrenceDbtoCsvFormat();
      this.exportService.exportCsvToDownloadsFile(csvOccurrence, 'occurrence');
      console.log('New ingest');
      console.log('Last ingest: ', this.lastIngestTime);
      console.log('Current ingest time: ', currentIngestTime);
      this.lastIngestTime = currentIngestTime;
    }
  }
}
