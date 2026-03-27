import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as JSZip from 'jszip';
import { ExportsService } from './exports.service';
import { AzureBlobService } from '../db/azure-blob/azure-blob.service';

@Injectable()
@Processor('exports')
export class ExportsProcessor extends WorkerHost {
  constructor(
    private readonly exportsService: ExportsService,
    private readonly azureBlobService: AzureBlobService
  ) {
    super();
    console.log('ExportsProcessor constructed');
  }

  @OnWorkerEvent('ready')
  onReady() {
    console.log('Exports worker is ready');
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log('Exports worker active job:', job.id, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log('Exports worker completed job:', job.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    console.error('Exports worker failed job:', job?.id, err.message);
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('Exports worker error:', err.message);
  }

  async process(job: Job<{ exportJobId: string }>) {
    console.log('ExportsProcessor picked job:', job.id, job.data);

    const exportJob = await this.exportsService.findById(job.data.exportJobId);

    if (!exportJob) {
      console.error('Export job not found for:', job.data.exportJobId);
      throw new Error('Export job not found');
    }

    await this.exportsService.markProcessing(exportJob.id);
    console.log('Marked processing:', exportJob.id);

    try {
      const filters = exportJob.filtersJson ?? {};
      console.log('Loaded filters:', filters);

      const csvContent = 'id,name\n1,example';
      const definitionsCsv = 'column,description\nid,Example ID';

      await this.exportsService.updateProgress(exportJob.id, 50);
      console.log('Updated progress to 50:', exportJob.id);

      const zip = new JSZip();
      zip.file('filteredVAData.csv', csvContent);
      zip.file('Definitions.csv', definitionsCsv);

      const buffer = await zip.generateAsync({ type: 'nodebuffer' });
      console.log('Generated zip buffer size:', buffer.length);

      const fileName = 'filteredData.zip';
      const blobPath = `${exportJob.id}/${fileName}`;

      const uploadResult = await this.azureBlobService._doUpload(
        buffer,
        blobPath
      );

      console.log('Uploaded export zip to blob:', uploadResult);

      await this.exportsService.updateProgress(exportJob.id, 100);

      await this.exportsService.markCompleted(
        exportJob.id,
        uploadResult.filePath,
        fileName
      );

      console.log('Marked completed:', exportJob.id, uploadResult.filePath);
    } catch (error: any) {
      console.error('Processor failed for job:', exportJob.id, error);

      await this.exportsService.markFailed(
        exportJob.id,
        error?.message ?? 'Unknown error'
      );
      throw error;
    }
  }
}
