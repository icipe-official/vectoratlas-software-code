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
  private currentIngestTime: LastIngest;
  constructor(
    @Inject(ExportService)
    private readonly exportService: ExportService,
  ) {
    this.lastIngestTime = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../../lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
    this.currentIngestTime = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../../lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  async exportAllDataToCsvFile() {
    await this.exportService.exportOccurrenceDbtoCsvFormat();
  }

  lastIngestWatch() {
    if (
      this.lastIngestTime !== null &&
      this.currentIngestTime.ingestion.ingestTime ===
        this.lastIngestTime.ingestion.ingestTime
    ) {
      console.log('no new ingest');
      return;
    } else {
      this.exportService.exportOccurrenceDbtoCsvFormat();
      console.log('new ingest - run csv - update lastIngestTime');
      console.log('Last ingest: ', this.lastIngestTime);
      console.log('Current ingest time: ', this.currentIngestTime);
    }
  }
}
