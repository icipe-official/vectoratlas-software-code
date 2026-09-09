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
import * as fs from 'fs';

import { CreateExportDto } from './dto/create-export.dto';
import { ExportsRepository } from './exports.repository';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { sanitize } from 'src/dataset-upload/utils';

@Injectable()
export class ExportsServiceV2 {
  private readonly accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  private readonly nodeEnv = process.env.NODE_ENV?.toLowerCase();

  constructor(
    private readonly exportsRepository: ExportsRepository,
    @InjectQueue('exports') private readonly exportsQueue: Queue,
    private azureBlobService: AzureBlobService,
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
    // Use AzureBlobService's container name resolution for consistency
    // This ensures upload and download use the same container
    return this.azureBlobService.getContainerName();
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
      return new BlobServiceClient(accountUrl, new DefaultAzureCredential());
    }
    const connectionString = this.getConnectionString();
    return BlobServiceClient.fromConnectionString(connectionString);
  }

  /**
   * Uploads local file from disk straight to Azure Blob using streams (prevents Heap OOM)
   */
  // async uploadLocalFileToAzureBlob(filePath: string, blobPath: string): Promise<string> {
  //   const containerClient = this.getBlobServiceClient().getContainerClient(this.getContainerName());
  //   await containerClient.createIfNotExists();
  //
  //   const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
  //   const fileStream = fs.createReadStream(filePath);
  //
  //   // Stream upload with 8MB block sizes
  //   await blockBlobClient.uploadStream(fileStream, 8 * 1024 * 1024, 5, {
  //     blobHTTPHeaders: { blobContentType: 'application/zip' },
  //   });
  //
  //   return blockBlobClient.url;
  // }
  private getContainerClient() {
    return this.getBlobServiceClient().getContainerClient(
      this.getContainerName(),
    );
  }

  async uploadLocalFileToAzureBlob(
    filePath: string,
    blobPath: string,
  ): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Upload failed: File does not exist at ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    console.log(
      `Uploading local ZIP to Azure/Azurite. Path: ${filePath}, Size: ${stats.size} bytes`,
    );

    if (stats.size === 0) {
      throw new Error(`Upload failed: File at ${filePath} is 0 bytes.`);
    }

    // Use AzureBlobService for consistency with download path
    const containerClient = this.azureBlobService
      .createConnectionClient()
      .getContainerClient(this.getContainerName());
    try {
      await containerClient.createIfNotExists();
    } catch (error) {
      // If container creation fails (e.g., due to permissions), log and continue
      // The container likely already exists in production
      console.warn(
        `Container createIfNotExists failed, assuming container exists: ${error.message}`,
      );
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    const fileStream = fs.createReadStream(filePath);

    console.log('blockBlobClient.url', blockBlobClient.url, blobPath);
    console.log('Container name:', this.getContainerName());

    // Stream upload with 8MB block sizes
    try {
      await blockBlobClient.uploadStream(fileStream, 8 * 1024 * 1024, 5, {
        blobHTTPHeaders: { blobContentType: 'application/zip' },
      });
    } catch (uploadError) {
      console.error('Blob upload failed:', uploadError.message);
      throw uploadError;
    }

    return blockBlobClient.url;
  }

  // Preserve existing repository methods
  async createExportJob(
    dto: CreateExportDto,
    userId?: string,
    occurrenceIds?: string[],
  ) {
    const parsedFilters = JSON.parse(dto.filtersJson);
    const normalizedFilters = JSON.parse(JSON.stringify(parsedFilters ?? {}));

    // Hash generation retained for job ID but reuse checking disabled
    // to ensure broken downloads (e.g., from incorrect blob URLs) are retried fresh
    const requestHash = createHash('sha256')
      .update(
        JSON.stringify({
          filters: normalizedFilters,
          generateDoi: !!dto.generateDoi,
          userScope: userId ?? 'anonymous',
          datasetVersion: 'v1',
        }),
      )
      .digest('hex');

    // Commented out: hash-based reuse logic can cause broken links to persist
    // const existing = await this.exportsRepository.findReusableByHash(requestHash);
    // if (existing) {
    //   return { jobId: existing.id, status: existing.status };
    // }

    const generateDoi = dto?.generateDoi.toString().toLowerCase() === 'true';
    const job = await this.exportsRepository.createAndSave({
      owner: userId,
      requestHash,
      status: 'queued',
      filtersJson: normalizedFilters,
      generateDoi,
      downloaderName: dto.downloaderName,
      downloaderEmail: dto.downloaderEmail,
      progress: 0,
      occurrence_ids: occurrenceIds,
    });

    await this.exportsQueue.add(
      'generate-export',
      { exportJobId: job.id },
      { jobId: `${requestHash}-${job.id}` },
    );

    return { jobId: job.id, status: job.status };
  }

  async getExportStatus(jobId: string) {
    const job = await this.exportsRepository.findById(jobId);
    if (!job) throw new NotFoundException('Export job not found');

    let downloadUrl = undefined;
    if (job.status === 'completed' && job.blobPath) {
      downloadUrl = await this.azureBlobService.getDownloadUrl(
        job.blobPath,
        job.fileName,
      );
    }

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      errorMessage: job.errorMessage,
      fileName: job.fileName,
      blobPath: job.blobPath,
      downloadUrl,
      expiresAt: job.expiresAt,
    };
  }

  // Inside exports.service-v2.ts class:

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
    // Uses existing azureBlobService download URL resolution
    const downloadUrl = await this.azureBlobService.getDownloadUrl(
      job.blobPath,
      job.fileName,
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
  async markExpired(id: string) {
    await this.exportsRepository.markExpired(id);
  }
  async findById(id: string) {
    return this.exportsRepository.findById(id);
  }
  async findByBlobPath(blobPath: string) {
    return this.exportsRepository.findByBlobPath(blobPath);
  }
}
