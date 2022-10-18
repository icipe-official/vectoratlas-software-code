import * as fs from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { handleLastIngestLock } from '../ingest/utils/triggerCsvRebuild';
import { ExportService } from '../export/export.service';
import { triggerAllDataCreationHandler } from '../ingest/utils/triggerCsvRebuild';

interface LastIngest {
  ingestion: {
    ingestTime: string;
    isLocked: boolean;
  };
}

@Injectable()
export class AllDataFileBuilder {
  private lastIngestTime: any;

  readLastIngest() {
    return JSON.parse(
      fs.readFileSync(process.cwd() + '/public/lastIngest.json', {
        encoding: 'utf8',
        flag: 'r',
      }),
    );
  }

  constructor(
    @Inject(ExportService)
    private readonly exportService: ExportService,
    private logger: Logger,
  ) {
    try {
      this.lastIngestTime = this.readLastIngest();
    } catch (e) {
      this.logger.error(e);
      triggerAllDataCreationHandler;
      this.lastIngestTime = this.readLastIngest();
    }
  }

  async exportAllDataToCsvFile() {
    await this.exportService.exportOccurrenceDbtoCsvFormat();
  }

  async lastIngestWatch() {
    const currentIngestTime: LastIngest = await this.readLastIngest();
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
