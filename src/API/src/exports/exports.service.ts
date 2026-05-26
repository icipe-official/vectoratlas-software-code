import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobServiceClient,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { CreateExportDto } from './dto/create-export.dto';
import { ExportsRepository } from './exports.repository';

@Injectable()
export class ExportsService {
  private readonly accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  private readonly nodeEnv = process.env.NODE_ENV?.toLowerCase();

  constructor(
    private readonly exportsRepository: ExportsRepository,
    @InjectQueue('exports') private readonly exportsQueue: Queue,
  ) {}

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
    if (process.env.AZURE_BLOB_CONTAINER) {
      return process.env.AZURE_BLOB_CONTAINER;
    }

    if (!this.isProduction()) {
      console.warn('AZURE_BLOB_CONTAINER not set, using dev fallback');
      return 'exports-dev';
    }

    throw new Error('AZURE_BLOB_CONTAINER is not set');
  }

  private parseConnectionString(
    connectionString: string,
  ): Record<string, string> {
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

    const sharedKeyCredential = this.getStorageSharedKeyCredential();
    const blockBlobClient = this.getBlobServiceClient()
      .getContainerClient(containerName)
      .getBlockBlobClient(blobPath);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: blobPath,
        permissions: BlobSASPermissions.parse('r'),
        expiresOn,
      },
      sharedKeyCredential,
    ).toString();

    return `${blockBlobClient.url}?${sasToken}`;
  }

  private normalizeFilters(filters: Record<string, any>) {
    return JSON.parse(JSON.stringify(filters ?? {}));
  }

  private buildRequestHash(payload: {
    filters: Record<string, any>;
    generateDoi?: boolean;
    userScope?: string;
    datasetVersion?: string;
  }) {
    return createHash('sha256')
      .update(
        JSON.stringify({
          filters: payload.filters,
          generateDoi: !!payload.generateDoi,
          userScope: payload.userScope ?? 'default',
          datasetVersion: payload.datasetVersion ?? 'v1',
        }),
      )
      .digest('hex');
  }

  async createExportJob(dto: CreateExportDto, userId?: string) {
    const parsedFilters = JSON.parse(dto.filtersJson);
    const normalizedFilters = this.normalizeFilters(parsedFilters);

    const requestHash = this.buildRequestHash({
      filters: normalizedFilters,
      generateDoi: dto.generateDoi,
      userScope: userId ?? 'anonymous',
      datasetVersion: 'v1',
    });

    const existing = await this.exportsRepository.findReusableByHash(
      requestHash,
    );

    if (existing) {
      console.log(
        'Reusing existing export job:',
        existing.id,
        'status:',
        existing.status,
        'requestHash:',
        requestHash,
      );

      return {
        jobId: existing.id,
        status: existing.status,
      };
    }

    const job = await this.exportsRepository.createAndSave({
      owner: userId,
      requestHash,
      status: 'queued',
      filtersJson: normalizedFilters,
      generateDoi: !!dto.generateDoi,
      downloaderName: dto.downloaderName,
      downloaderEmail: dto.downloaderEmail,
      progress: 0,
    });

    console.log('Created export DB job:', job.id, 'requestHash:', requestHash);

    const queuedJob = await this.exportsQueue.add(
      'generate-export',
      { exportJobId: job.id },
      { jobId: `${requestHash}-${job.id}` },
    );

    console.log(
      'Queued Bull job:',
      queuedJob.id,
      'name:',
      queuedJob.name,
      'data:',
      queuedJob.data,
    );

    return {
      jobId: job.id,
      status: job.status,
    };
  }

  async getExportStatus(jobId: string) {
    const job = await this.exportsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      errorMessage: job.errorMessage,
      fileName: job.fileName,
      blobPath: job.blobPath,
      downloadUrl:
        job.status === 'completed' && job.blobPath
          ? await this.generateBlobSasUrl(job.blobPath, 60)
          : undefined,
      expiresAt: job.expiresAt,
    };
  }

  async getDownloadLink(jobId: string) {
    const job = await this.exportsRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Export job not found');
    }

    if (job.status !== 'completed') {
      throw new BadRequestException('Export is not ready yet');
    }

    if (!job.blobPath) {
      throw new BadRequestException('Export blob path is missing');
    }

    const expiresInMinutes = 60;
    const downloadUrl = await this.generateBlobSasUrl(
      job.blobPath,
      expiresInMinutes,
    );

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      fileName: job.fileName,
      blobPath: job.blobPath,
      downloadUrl,
      expiresInMinutes,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    };
  }

  async markProcessing(id: string) {
    await this.exportsRepository.markProcessing(id);
  }

  async updateProgress(id: string, progress: number) {
    await this.exportsRepository.updateProgress(id, progress);
  }

  async markCompleted(id: string, blobPath: string, fileName: string) {
    await this.exportsRepository.markCompleted(id, blobPath, fileName);
  }

  async markFailed(id: string, errorMessage: string) {
    await this.exportsRepository.markFailed(id, errorMessage);
  }

  async findById(id: string) {
    return this.exportsRepository.findById(id);
  }
}
