import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
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
  private readonly containerName = 'exports';

  constructor(
    private readonly exportsRepository: ExportsRepository,
    @InjectQueue('exports') private readonly exportsQueue: Queue,
  ) { }

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

  private getBlobServiceClient(): BlobServiceClient {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }

    return BlobServiceClient.fromConnectionString(connectionString);
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

    const blockBlobClient = this.getBlobServiceClient()
      .getContainerClient(this.containerName)
      .getBlockBlobClient(blobPath);

    return `${blockBlobClient.url}?${sasToken}`;
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

    const existing = await this.exportsRepository.findReusableByHash(requestHash);

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
          ? this.generateBlobSasUrl(job.blobPath, 60)
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
    const downloadUrl = this.generateBlobSasUrl(job.blobPath, expiresInMinutes);

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
