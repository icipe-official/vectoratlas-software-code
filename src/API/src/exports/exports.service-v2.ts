import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import * as fs from 'fs';

import { CreateExportDto } from './dto/create-export.dto';
import { ExportsRepository } from './exports.repository';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';

// Whether to use expiring SAS URLs for download links.
// When false, returns permanent blob URLs (may 403 on private containers).
// When true, generates read-only SAS tokens with a configurable TTL.
const USE_SAS_EXPIRING_URLS =
  (process.env.EXPORT_USE_SAS_URLS || 'true').toLowerCase() === 'true';

// How long the SAS download URL remains valid, in minutes.
const SAS_URL_TTL_MINUTES = parseInt(
  process.env.EXPORT_SAS_URL_TTL_MINUTES || '120',
  10,
);

@Injectable()
export class ExportsServiceV2 {
  private readonly logger = new Logger(ExportsServiceV2.name);

  constructor(
    private readonly exportsRepository: ExportsRepository,
    @InjectQueue('exports') private readonly exportsQueue: Queue,
    private azureBlobService: AzureBlobService,
  ) {}

  private getContainerName(): string {
    return this.azureBlobService.getContainerName();
  }

  private getConnectionString(): string {
    const val = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!val || !val.trim()) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }
    return val;
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

  /**
   * Extracts AccountName and AccountKey from the Azure connection string
   * and creates a StorageSharedKeyCredential for SAS token generation.
   * This is a local cryptographic operation — no network call required.
   */
  private getStorageSharedKeyCredential(): StorageSharedKeyCredential {
    const parts = this.parseConnectionString(this.getConnectionString());
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

  /**
   * Generates a read-only SAS URL for a blob, valid for SAS_URL_TTL_MINUTES.
   * Uses the StorageSharedKeyCredential from the connection string — no
   * DefaultAzureCredential or UserDelegationKey required.
   *
   * The blob URL is constructed from the connection string's BlobEndpoint,
   * so it works correctly for both Azure production and Azurite (local dev).
   */
  private async generateBlobSasUrl(blobPath: string): Promise<string> {
    const containerName = this.getContainerName();
    const credential = this.getStorageSharedKeyCredential();
    const now = new Date();
    const startsOn = new Date(now.getTime() - 15 * 60 * 1000);
    const expiresOn = new Date(now.getTime() + SAS_URL_TTL_MINUTES * 60 * 1000);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: blobPath,
        permissions: BlobSASPermissions.parse('r'),
        startsOn,
        expiresOn,
      },
      credential,
    ).toString();

    // Construct the blob URL from the connection string so the endpoint
    // is correct for both Azure (https://*.blob.core.windows.net) and
    // Azurite (http://host:port/devstoreaccount1). Using fromConnectionString
    // ensures the BlobEndpoint from the connection string is respected.
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.getConnectionString(),
    );
    const blockBlobClient = blobServiceClient
      .getContainerClient(containerName)
      .getBlockBlobClient(blobPath);

    const sasUrl = `${blockBlobClient.url}?${sasToken}`;
    this.logger.debug(
      `Generated SAS URL for ${blobPath}, expires in ${SAS_URL_TTL_MINUTES}m`,
    );
    return sasUrl;
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
  async uploadLocalFileToAzureBlob(
    filePath: string,
    blobPath: string,
  ): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Upload failed: File does not exist at ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    this.logger.log(
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
      this.logger.warn(
        `Container createIfNotExists failed, assuming container exists: ${error.message}`,
      );
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    const fileStream = fs.createReadStream(filePath);

    this.logger.debug(`blockBlobClient.url ${blockBlobClient.url} ${blobPath}`);
    this.logger.debug(`Container name: ${this.getContainerName()}`);

    // Stream upload with 8MB block sizes
    try {
      await blockBlobClient.uploadStream(fileStream, 8 * 1024 * 1024, 5, {
        blobHTTPHeaders: { blobContentType: 'application/zip' },
      });
    } catch (uploadError) {
      this.logger.error('Blob upload failed:', uploadError.message);
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

    // --- Idempotency: check for existing job by clientRequestId ---
    // If the client sent a clientRequestId (generated once per download
    // attempt, reused across retries), check if a job already exists.
    // This prevents "zombie" jobs when a POST succeeds on the server
    // but the response is lost (e.g. envoy 504 timeout).
    if (dto.clientRequestId) {
      const existing = await this.exportsRepository.findByClientRequestId(
        dto.clientRequestId,
      );
      if (existing) {
        this.logger.log(
          `Idempotency hit: found existing job ${existing.id} (status: ${existing.status}) for clientRequestId ${dto.clientRequestId}`,
        );
        return { jobId: existing.id, status: existing.status };
      }
    }

    // --- Cross-user reuse: check for completed job with same content ---
    // When occurrence IDs are provided, the client sends a contentHash
    // (SHA-256 of sorted IDs). If another user already exported the exact
    // same row set and the blob still exists, reuse that job instead of
    // re-processing. This is safe because the row set is identical.
    // When no IDs are provided (download all), contentHash is null —
    // no reuse, because the underlying data may have changed.
    if (dto.contentHash) {
      const reusable = await this.exportsRepository.findReusableByContentHash(
        dto.contentHash,
      );
      if (reusable && reusable.blobPath) {
        this.logger.log(
          `Content reuse hit: found completed job ${reusable.id} with matching contentHash ${dto.contentHash}`,
        );
        return { jobId: reusable.id, status: reusable.status };
      }
    }

    // Generate a unique hash for the BullMQ job ID
    const requestHash = createHash('sha256')
      .update(
        JSON.stringify({
          filters: normalizedFilters,
          generateDoi: !!dto.generateDoi,
          userScope: userId ?? 'anonymous',
          datasetVersion: 'v1',
          timestamp: Date.now(),
        }),
      )
      .digest('hex');

    const generateDoi = dto?.generateDoi.toString().toLowerCase() === 'true';
    const job = await this.exportsRepository.createAndSave({
      owner: userId,
      requestHash,
      clientRequestId: dto.clientRequestId,
      contentHash: dto.contentHash,
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
      if (USE_SAS_EXPIRING_URLS) {
        downloadUrl = await this.generateBlobSasUrl(job.blobPath);
      } else {
        downloadUrl = await this.azureBlobService.getDownloadUrl(
          job.blobPath,
          job.fileName,
        );
      }
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

    let downloadUrl: string;
    if (USE_SAS_EXPIRING_URLS) {
      downloadUrl = await this.generateBlobSasUrl(job.blobPath);
    } else {
      downloadUrl = await this.azureBlobService.getDownloadUrl(
        job.blobPath,
        job.fileName,
      );
    }

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      fileName: job.fileName,
      blobPath: job.blobPath,
      downloadUrl,
      expiresInMinutes: SAS_URL_TTL_MINUTES,
      expiresAt: new Date(Date.now() + SAS_URL_TTL_MINUTES * 60 * 1000),
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
