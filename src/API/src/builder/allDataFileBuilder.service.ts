import * as fs from 'fs';
import { Inject, Injectable } from '@nestjs/common';
import { handleLastIngestLock } from '../ingest/utils/triggerCsvRebuild';
import { ExportService } from '../export/export.service';

interface LastIngest {
  ingestion: {
    ingestTime: string;
    isLocked: boolean;
  };
}

@Injectable()
export class AllDataFileBuilder {
  private lastIngestTime: any;

  constructor(
    @Inject(ExportService)
    private readonly exportService: ExportService,
  ) {}

  readLastIngest() {
    return JSON.parse(
      fs.readFileSync(process.cwd() + '/public/lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  initialiseBuilder() {
    this.lastIngestTime = this.readLastIngest();
  }

  async exportAllDataToCsvFile() {
    await this.exportService.exportOccurrenceDbtoCsvFormat();
  }

  async lastIngestWatch() {
    const currentIngestTime: LastIngest = this.readLastIngest();
    if (
      this.lastIngestTime !== null &&
      currentIngestTime.ingestion.ingestTime ===
        this.lastIngestTime.ingestion.ingestTime
    ) {
      return;
    } else {
      const csvOccurrence: any =
        await this.exportService.exportOccurrenceDbtoCsvFormat();
      await this.exportService.exportCsvToDownloadsFile(
        csvOccurrence,
        'occurrence',
      );
      handleLastIngestLock(false);
      console.log(' New Ingest');
      console.log('   Last Ingest Time: ', this.lastIngestTime);
      console.log('   Current Ingest Time: ', currentIngestTime);
      this.lastIngestTime = currentIngestTime;
    }
  }
}
