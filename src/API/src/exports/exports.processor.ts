import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as JSZip from 'jszip';
import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { ExportsService } from './exports.service';

@Injectable()
@Processor('exports')
export class ExportsProcessor extends WorkerHost {
  private readonly containerName = process.env.AZURE_BLOB_CONTAINER;
  private readonly accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  private readonly nodeEnv = process.env.NODE_ENV?.toLowerCase();

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

  private isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getRequiredEnv(name: string, value?: string): string {
    if (!value || !value.trim()) {
      throw new Error(`${name} is not set`);
    }
    return value;
  }

  private getContainerName(): string {
    // use env if provided
    if (process.env.AZURE_BLOB_CONTAINER) {
      return process.env.AZURE_BLOB_CONTAINER;
    }

    // fallback only for dev
    if (process.env.NODE_ENV !== 'production') {
      console.warn('AZURE_BLOB_CONTAINER not set, using dev fallback');
      return 'exports-dev';
    }

    // fail hard in prod
    throw new Error('AZURE_BLOB_CONTAINER is not set');
  }
  private parseConnectionString(connectionString: string): Record<string, string> {
    return Object.fromEntries(
      connectionString.split(';').map((entry) => {
        const [key, ...rest] = entry.split('=');
        return [key, rest.join('=')];
      }),
    );
  }

  private getConnectionString(): string {
    return this.getRequiredEnv(
      'AZURE_STORAGE_CONNECTION_STRING',
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
  }

  private getBlobServiceClient(): BlobServiceClient {
    if (this.isProduction()) {
      const accountName = this.getRequiredEnv(
        'AZURE_STORAGE_ACCOUNT_NAME',
        this.accountName,
      );

      const accountUrl = `https://${accountName}.blob.core.windows.net`;
      console.log('Using workload identity for Blob Storage');

      return new BlobServiceClient(accountUrl, new DefaultAzureCredential());
    }

    const connectionString = this.getConnectionString();
    console.log('Using connection string for Blob Storage');

    return BlobServiceClient.fromConnectionString(connectionString);
  }

  private getContainerClient(): ContainerClient {
    return this.getBlobServiceClient().getContainerClient(this.getContainerName());
  }

  private getStorageSharedKeyCredential(): StorageSharedKeyCredential {
    const connectionString = this.getConnectionString();
    const parts = this.parseConnectionString(connectionString);

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

  private async generateBlobSasUrl(
    blobPath: string,
    expiresInMinutes = 60,
  ): Promise<string> {
    const containerName = this.getContainerName();
    const expiresOn = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    if (this.isProduction()) {
      const accountName = this.getRequiredEnv(
        'AZURE_STORAGE_ACCOUNT_NAME',
        this.accountName,
      );

      const blobServiceClient = this.getBlobServiceClient();
      const startsOn = new Date(Date.now() - 5 * 60 * 1000);

      const userDelegationKey = await blobServiceClient.getUserDelegationKey(
        startsOn,
        expiresOn,
      );

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: blobPath,
          permissions: BlobSASPermissions.parse('r'),
          startsOn,
          expiresOn,
        },
        userDelegationKey,
        accountName,
      ).toString();

      return `https://${accountName}.blob.core.windows.net/${containerName}/${blobPath}?${sasToken}`;
    }

    const containerClient = this.getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(blobPath);
    const sharedKeyCredential = this.getStorageSharedKeyCredential();

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: blobPath,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    return `${blobClient.url}?${sasToken}`;
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

      await containerClient.createIfNotExists();

      const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: 'application/zip',
        },
      });

      console.log('Uploaded export zip to blob:', blobPath);

      const downloadUrl = await this.generateBlobSasUrl(blobPath, 60);
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
