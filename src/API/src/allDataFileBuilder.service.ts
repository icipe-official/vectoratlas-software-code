const fs = require('fs');
import { Inject, Injectable } from '@nestjs/common';
import { handleLastIngestLock } from 'src/ingest/utils/triggerCsvRebuild';
import { ExportService } from './export/export.service';

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
      return;
    } else {
      const csvOccurrence: any =
        await this.exportService.exportOccurrenceDbtoCsvFormat();
      this.exportService.exportCsvToDownloadsFile(csvOccurrence, 'occurrence');
      handleLastIngestLock(false);
      console.log(' New Ingest');
      console.log('   Last Ingest Time: ', this.lastIngestTime);
      console.log('   Current Ingest Time: ', currentIngestTime);
      this.lastIngestTime = currentIngestTime;
    }
  }
}
