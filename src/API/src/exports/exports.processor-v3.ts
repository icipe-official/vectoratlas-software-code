import { Injectable, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';
import config from 'src/config/config';

import { ExportsServiceV2 } from './exports.service-v2';
import { EmailService } from '../email/email.service';
import { DynamicExportServiceV3 } from 'src/db/shared/dynamic-export.service-v3';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import {
  RAW_TEMPLATE_FIELD_EXCLUDED,
  RAW_TEMPLATE_FIELD_MAPPING,
} from 'src/db/occurrence/template-mapping';
import { extractFileNameFromBlobUrl, maskEmail } from 'src/utils';

/**
 * V3 processor — identical to V2 except it uses DynamicExportServiceV3,
 * which fetches flat rows via a raw QueryBuilder (leftJoin + addSelect +
 * getRawMany) instead of hydrating entities and mapping them to rows.
 *
 * To test: swap ExportsProcessorV2 for ExportsProcessorV3 in exports.module.ts
 * (only one @Processor('exports') can be active at a time).
 */
@Injectable()
@Processor('exports')
export class ExportsProcessorV3 extends WorkerHost {
  private readonly logger = new Logger(ExportsProcessorV3.name);
  constructor(
    private readonly exportsService: ExportsServiceV2,
    private readonly emailService: EmailService,
    private readonly dynamicExportService: DynamicExportServiceV3<Occurrence>,
  ) {
    super();
    this.logger.log('ExportsProcessorV3 constructed');
  }

  @OnWorkerEvent('ready')
  onReady() {
    this.logger.log('Exports worker v3 is ready');
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Exports worker v3 active job: ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Exports worker v3 completed job: ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(
      `Exports worker v3 failed job: ${job?.id} ${err?.message}`,
    );
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    this.logger.error(`Exports worker v3 error: ${err?.message}`);
  }

  formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  async process(job: Job<{ exportJobId: string }>) {
    const USE_SAS_EXPIRING_URLS = false;

    this.logger.log(`ExportsProcessor picked job v3: ${job.id}`);

    const exportJob = await this.exportsService.findById(job.data.exportJobId);
    if (!exportJob) throw new Error('Export job not found v3');

    await this.exportsService.markProcessing(exportJob.id);

    const tmpDir = path.join(process.cwd(), 'tmp-exports');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const excelFilePath = path.join(tmpDir, `va_data_${exportJob.id}.xlsx`);
    const zipFilePath = path.join(tmpDir, `filteredData-${exportJob.id}.zip`);

    try {
      const rawFilters = exportJob.filtersJson ?? {};
      this.logger.log(
        `Occurrence Ids scheduled length: ${
          exportJob.occurrence_ids?.length?.toString() ?? '0'
        }`,
      );

      const sanitizedFilters = this.sanitizeFilters(rawFilters);

      this.logger.log(
        `Final Sanitized Filters for Service: ${JSON.stringify(
          sanitizedFilters,
        )}`,
      );

      const take = config.get('dataExportBatchSize');
      const yieldAfter = config.get('dataExportYieldAfter');
      const saveToDisk = true;

      await this.dynamicExportService.exportAllToExcelBackground(
        sanitizedFilters,
        RAW_TEMPLATE_FIELD_MAPPING,
        excelFilePath,
        take,
        yieldAfter,
        exportJob,
        (jobId, progress) => {
          this.exportsService.updateProgress(jobId, progress);
        },
        saveToDisk,
        RAW_TEMPLATE_FIELD_EXCLUDED,
        exportJob.occurrence_ids,
        exportJob.generateDoi,
      );

      await this.createZipFileOnDisk(excelFilePath, zipFilePath);
      await this.exportsService.updateProgress(exportJob.id, 90);

      let fileName = `filteredData-${exportJob.id}.zip`;
      let blobPath = `${exportJob.id}/${fileName}`;
      let uploadedFileUrl = null;

      if (USE_SAS_EXPIRING_URLS === false) {
        uploadedFileUrl = await this.exportsService.uploadLocalFileToAzureBlob(
          zipFilePath,
          blobPath,
        );
        blobPath = extractFileNameFromBlobUrl(uploadedFileUrl);
        fileName = blobPath.split('/')[1];
      } else {
        uploadedFileUrl = await this.exportsService.uploadLocalFileToAzureBlob(
          zipFilePath,
          blobPath,
        );
      }

      await this.exportsService.updateProgress(exportJob.id, 100);
      await this.exportsService.markCompleted(exportJob.id, blobPath, fileName);

      if (exportJob.downloaderEmail) {
        const updatedExportJob = await this.exportsService.findById(
          exportJob.id,
        );

        if (USE_SAS_EXPIRING_URLS) {
          const { downloadUrl } = await this.exportsService.getDownloadLink(
            updatedExportJob.id,
          );
          uploadedFileUrl = downloadUrl;
        }

        const dateDownloaded = this.formatDate(
          updatedExportJob.modified || new Date(),
        );

        const doiLink =
          updatedExportJob.doi?.doi_link ??
          'https://doi.org/10.60798/DSVG-T752';

        const emailBody = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #2e7d32;">Your Data Export is Ready</h2>
            <p>Hello ${updatedExportJob.downloaderName || 'User'},</p>
            <p>The VectorAtlas data export you requested has been processed successfully!</p>
            <p>Note that the download link will <span style="color:rgb(251,51,51)"> expire after 3 days.</span> </p>
            <p>
              Kindly cite this dataset as follows: The Vector Atlas DataBase (VADB) downloaded ${dateDownloaded}, https://vectoratlas.icipe.org/, DOI: ${doiLink}. (please ensure original data sources are maintained)
            </p>
            <div style="margin: 25px 0;">
              <a href="${uploadedFileUrl}"
                 style="background-color: #2e7d32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Download ZIP File
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p>Best regards,<br/>The VectorAtlas Team</p>
          </div>
        `;

        await this.emailService.sendEmail(
          [updatedExportJob.downloaderEmail],
          [],
          'Your VectorAtlas Data Export is Ready',
          emailBody,
        );

        try {
          this.logger.log(
            `Notification email sent to ${maskEmail(
              updatedExportJob.downloaderEmail,
            )}`,
          );
        } catch (e) {}
      }

      this.logger.log(`Marked completed v3: ${exportJob.id}`);
    } catch (error: any) {
      this.logger.error(`Processor failed for job v3: ${exportJob.id}`, error);
      await this.exportsService.markFailed(
        exportJob.id,
        error?.message ?? 'Unknown error',
      );
      throw error;
    } finally {
      if (fs.existsSync(excelFilePath)) fs.unlinkSync(excelFilePath);
      if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
    }
  }

  private createZipFileOnDisk(
    sourceFilePath: string,
    targetZipPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const zip = new JSZip();

      const fileStream = fs.createReadStream(sourceFilePath);
      zip.file(`va_data_${Date.now()}.xlsx`, fileStream);

      const templatesFolder = config.get('dataTemplatesFolder');
      const guideFileName = config.get('databaseGuideFileName');
      const guideDocPath = path.join(
        templatesFolder,
        'Vector Atlas',
        guideFileName,
      );
      if (fs.existsSync(guideDocPath)) {
        const guideBuffer = fs.readFileSync(guideDocPath);
        zip.file(guideFileName, guideBuffer);
      } else {
        this.logger.warn(
          `Vector Atlas Database Guide document not found at: ${guideDocPath}`,
        );
      }

      const outputStream = fs.createWriteStream(targetZipPath);

      outputStream.on('finish', () => {
        this.logger.log('ZIP output stream finished flushing to disk.');
        resolve();
      });

      outputStream.on('error', (err) => {
        this.logger.error('Error writing ZIP file to disk:', err);
        reject(err);
      });

      zip
        .generateNodeStream({
          type: 'nodebuffer',
          streamFiles: true,
          compression: 'DEFLATE',
          compressionOptions: { level: 6 },
        })
        .pipe(outputStream)
        .on('error', (err) => {
          this.logger.error('Error in JSZip node stream:', err);
          reject(err);
        });
    });
  }

  private sanitizeFilters(rawFilters: any): any {
    const sanitizedFilters: any = {};
    const arrayFields = [
      'country',
      'species',
      'insecticide',
      'binary_presence',
      'abundance_data',
      'bionomics',
      'isLarval',
      'isAdult',
      'control',
      'season',
    ];

    for (const key of Object.keys(rawFilters)) {
      let val = rawFilters[key];

      if (
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === 'object' &&
        'value' in val[0]
      ) {
        val = val[0].value;
      } else if (val && typeof val === 'object' && 'value' in val) {
        val = val.value;
      }

      if (
        val === undefined ||
        val === null ||
        (Array.isArray(val) && val.length === 0)
      )
        continue;

      if (key === 'timeRange' && typeof val === 'object' && val !== null) {
        if (val.start) {
          sanitizedFilters['startTimestamp'] = val.start;
        }
        if (val.end) {
          sanitizedFilters['endTimestamp'] = val.end;
        }
        continue;
      }

      if (
        key === 'ir_data' ||
        key === 'insecticideResistance' ||
        key === 'insecticide'
      ) {
        sanitizedFilters['insecticide'] = Array.isArray(val) ? val : [val];
      } else if (arrayFields.includes(key)) {
        sanitizedFilters[key] = Array.isArray(val) ? val : [val];
      } else if (key === 'startTimestamp' || key === 'endTimestamp') {
        sanitizedFilters[key] = val;
      } else {
        sanitizedFilters[key] = val;
      }
    }
    return sanitizedFilters;
  }
}
