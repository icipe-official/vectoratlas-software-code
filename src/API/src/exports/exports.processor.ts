import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as JSZip from 'jszip';
import {
  BlobServiceClient,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { ExportsService } from './exports.service';

@Injectable()
@Processor('exports')
export class ExportsProcessor extends WorkerHost {
  private readonly containerName = 'exports';

  constructor(private readonly exportsService: ExportsService) {
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

  private getBlobServiceClient(): BlobServiceClient {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }

    return BlobServiceClient.fromConnectionString(connectionString);
  }

  private getContainerClient() {
    return this.getBlobServiceClient().getContainerClient(this.containerName);
  }

  private getStorageSharedKeyCredential(): StorageSharedKeyCredential {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }

    const parts = Object.fromEntries(
      connectionString.split(';').map((entry) => {
        const [key, ...rest] = entry.split('=');
        return [key, rest.join('=')];
      }),
    );

    const accountName = parts.AccountName;
    const accountKey = parts.AccountKey;

    if (!accountName) {
      throw new Error(
        'AccountName could not be parsed from AZURE_STORAGE_CONNECTION_STRING',
      );
    }

    if (!accountKey) {
      throw new Error(
        'AccountKey could not be parsed from AZURE_STORAGE_CONNECTION_STRING',
      );
    }

    return new StorageSharedKeyCredential(accountName, accountKey);
  }

  private generateBlobSasUrl(blobPath: string, expiresInMinutes = 60): string {
    const sharedKeyCredential = this.getStorageSharedKeyCredential();
    const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobPath,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    return `https://${sharedKeyCredential.accountName}.blob.core.windows.net/${this.containerName}/${blobPath}?${sasToken}`;
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

      const fileName = `filteredData-${exportJob.id}.zip`;
      const blobPath = `${exportJob.id}/${fileName}`;

      const containerClient = this.getContainerClient();

      // optional but nice for first-time setup
      await containerClient.createIfNotExists();

      const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: 'application/zip',
        },
      });

      console.log('Uploaded export zip to blob:', blobPath);

      const downloadUrl = this.generateBlobSasUrl(blobPath, 60);
      console.log('Generated SAS URL:', downloadUrl);

      await this.exportsService.updateProgress(exportJob.id, 100);

      await this.exportsService.markCompleted(
        exportJob.id,
        blobPath,
        fileName,
      );

      console.log('Marked completed:', exportJob.id, blobPath);
    } catch (error: any) {
      console.error('Processor failed for job:', exportJob.id, error);

      await this.exportsService.markFailed(
        exportJob.id,
        error?.message ?? 'Unknown error',
      );

      throw error;
    }
  }
}
