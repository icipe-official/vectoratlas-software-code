import { Injectable } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import JSZip from 'jszip';
import { ExportsService } from './exports.service';

@Injectable()
@Processor('exports')
export class ExportsProcessor extends WorkerHost {
  constructor(private readonly exportsService: ExportsService) {
    super();
  }

  async process(job: Job<{ exportJobId: string }>) {
    const exportJob = await this.exportsService.findById(job.data.exportJobId);

    if (!exportJob) {
      throw new Error('Export job not found');
    }

    await this.exportsService.markProcessing(exportJob.id);

    try {
      const filters = exportJob.filtersJson ?? {};

      // TODO: Replace this placeholder with your real paginated fetch logic
      // using the same filter semantics your current frontend thunk uses.
      void filters;

      const csvContent = 'id,name\n1,example';
      const definitionsCsv = 'column,description\nid,Example ID';

      await this.exportsService.updateProgress(exportJob.id, 50);

      const zip = new JSZip();
      zip.file('filteredVAData.csv', csvContent);
      zip.file('Definitions.csv', definitionsCsv);

      const buffer = await zip.generateAsync({ type: 'nodebuffer' });

      // TODO: upload `buffer` to Azure Blob and return actual blob path
      void buffer;
      const blobPath = `${exportJob.id}/filteredData.zip`;

      await this.exportsService.markCompleted(
        exportJob.id,
        blobPath,
        'filteredData.zip'
      );
    } catch (error: any) {
      await this.exportsService.markFailed(
        exportJob.id,
        error?.message ?? 'Unknown error'
      );
      throw error;
    }
  }
}
