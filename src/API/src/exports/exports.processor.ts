import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as JSZip from 'jszip';

import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobServiceClient,
} from '@azure/storage-blob';

import { ExportsService } from './exports.service';
import { OccurrenceResolver } from '../db/occurrence/occurrence.resolver';
import { EmailService } from '../email/email.service';

@Injectable()
@Processor('exports')
export class ExportsProcessor extends WorkerHost {
  private readonly containerName = process.env.AZURE_BLOB_CONTAINER;
  private readonly accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  private readonly nodeEnv = process.env.NODE_ENV?.toLowerCase();

  constructor(
    private readonly exportsService: ExportsService,
    private readonly occurrenceResolver: OccurrenceResolver,
    private readonly emailService: EmailService,
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

  private getBlobServiceClient(): BlobServiceClient {
    if (this.isProduction()) {
      const accountName = this.getRequiredEnv('AZURE_STORAGE_ACCOUNT_NAME', this.accountName);
      const accountUrl = `https://${accountName}.blob.core.windows.net`;
      return new BlobServiceClient(accountUrl, new DefaultAzureCredential());
    }

    const connectionString = this.getRequiredEnv(
      'AZURE_STORAGE_CONNECTION_STRING',
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    return BlobServiceClient.fromConnectionString(connectionString);
  }

  private getContainerClient() {
    return this.getBlobServiceClient().getContainerClient(this.getContainerName());
  }

  async process(job: Job<{ exportJobId: string }>) {
    console.log('ExportsProcessor picked job:', job.id, job.data);

    const exportJob = await this.exportsService.findById(job.data.exportJobId);
    if (!exportJob) throw new Error('Export job not found');

    await this.exportsService.markProcessing(exportJob.id);

    try {
      const rawFilters = exportJob.filtersJson ?? {};
      const generateDoi = !!exportJob.generateDoi;

      // 1. ROBUST UNWRAPPING & SANITIZATION
      const sanitizedFilters: any = {};
      const arrayFields = [
        'country', 'species', 'insecticide', 'binary_presence',
        'abundance_data', 'bionomics', 'isLarval', 'isAdult', 'control', 'season'
      ];

      for (const key of Object.keys(rawFilters)) {
        let val = rawFilters[key];

        // Unwrap metadata objects like { value: ["kenya"] } or [{ value: [] }]
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && 'value' in val[0]) {
          val = val[0].value;
        } else if (val && typeof val === 'object' && 'value' in val) {
          val = val.value;
        }

        // Drop null/empty to prevent Postgres boolean type errors
        if (val === undefined || val === null || (Array.isArray(val) && val.length === 0)) continue;

        // Map UI field names to Backend resolver expectations
        if (key === 'ir_data' || key === 'insecticideResistance' || key === 'insecticide') {
          sanitizedFilters['insecticide'] = Array.isArray(val) ? val : [val];
        } else if (arrayFields.includes(key)) {
          sanitizedFilters[key] = Array.isArray(val) ? val : [val];
        } else if (key === 'startTimestamp' || key === 'endTimestamp') {
          sanitizedFilters[key] = val;
        }
      }

      console.log('Final Sanitized Filters for Resolver:', JSON.stringify(sanitizedFilters));

      // 2. PAGINATION LOOP: Fetching data from Resolver
      const take = 500;
      let skip = 0;
      let hasMore = true;
      const allCsvLines: string[] = [];

      while (hasMore) {
        const isFirstPage = skip === 0;

        const pageOfData = await this.occurrenceResolver.OccurrenceCsvData(
          { take, skip },
          sanitizedFilters,
          { locationWindowActive: false },
          isFirstPage ? generateDoi : false,
          isFirstPage ? exportJob.downloaderEmail : undefined,
          isFirstPage ? exportJob.downloaderName : undefined,
        );

        allCsvLines.push(...pageOfData.items);

        hasMore = pageOfData.hasMore;
        skip += take;

        const total = pageOfData.total || 1;
        const progress = Math.round((Math.min(skip, total) / total) * 85);
        await this.exportsService.updateProgress(exportJob.id, progress);
      }

      // 3. ASSEMBLE & ZIP CONTENT
      const csvContent = allCsvLines.join('\n');
      const zip = new JSZip();
      zip.file('filteredVAData.csv', csvContent);

      const buffer = await zip.generateAsync({ type: 'nodebuffer' });
      await this.exportsService.updateProgress(exportJob.id, 90);

      // 4. UPLOAD TO AZURE BLOB STORAGE
      const fileName = `filteredData-${exportJob.id}.zip`;
      const blobPath = `${exportJob.id}/${fileName}`;
      const containerClient = this.getContainerClient();

      await containerClient.createIfNotExists();
      const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: 'application/zip' },
      });

      // 5. MARK COMPLETED
      await this.exportsService.updateProgress(exportJob.id, 100);
      await this.exportsService.markCompleted(exportJob.id, blobPath, fileName);

      // 6. SEND EMAIL NOTIFICATION
      if (exportJob.downloaderEmail) {
        // Fetch fresh download link from the Service (which handles SAS generation)
        const { downloadUrl } = await this.exportsService.getDownloadLink(exportJob.id);

        const emailBody = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #2e7d32;">Your Data Export is Ready</h2>
            <p>Hello ${exportJob.downloaderName || 'User'},</p>
            <p>The VectorAtlas data export you requested has been processed successfully.</p>
            <div style="margin: 25px 0;">
              <a href="${downloadUrl}" 
                 style="background-color: #2e7d32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Download ZIP File
              </a>
            </div>
            <p style="font-size: 0.85em; color: #777;">
              Note: For security, this link will expire in 60 minutes.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p>Best regards,<br/>The VectorAtlas Team</p>
          </div>
        `;

        // Matches your sendEmail(emails[], copyEmails[], title, body) signature
        await this.emailService.sendEmail(
          [exportJob.downloaderEmail],
          [],
          'Your VectorAtlas Data Export is Ready',
          emailBody
        );

        console.log(`Notification email sent to ${exportJob.downloaderEmail}`);
      }

      console.log('Marked completed:', exportJob.id);

    } catch (error: any) {
      console.error('Processor failed for job:', exportJob.id, error);
      await this.exportsService.markFailed(exportJob.id, error?.message ?? 'Unknown error');
      throw error;
    }
  }
}
