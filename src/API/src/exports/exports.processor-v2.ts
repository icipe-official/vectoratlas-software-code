import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip'; // Works reliably with TypeScript in NestJS
import config from 'src/config/config';

import { ExportsServiceV2 } from './exports.service-v2';
import { EmailService } from '../email/email.service';
import { DynamicExportServiceV2 } from 'src/db/shared/dynamic-export.service-v2';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import {
  RAW_TEMPLATE_FIELD_EXCLUDED,
  RAW_TEMPLATE_FIELD_MAPPING,
} from 'src/db/occurrence/template-mapping';
import { extractFileNameFromBlobUrl, maskEmail } from 'src/utils';

@Injectable()
@Processor('exports')
export class ExportsProcessorV2 extends WorkerHost {
  constructor(
    private readonly exportsService: ExportsServiceV2,
    private readonly emailService: EmailService,
    private readonly dynamicExportService: DynamicExportServiceV2<Occurrence>,
  ) {
    super();
    console.log('ExportsProcessorV2 constructed');
  }

  @OnWorkerEvent('ready')
  onReady() {
    console.log('Exports worker v2 is ready');
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log('Exports worker v2 active job:', job.id, job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log('Exports worker v2 completed job:', job.id);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    console.error('Exports worker v2 failed job:', job?.id, err?.message);
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('Exports worker v2 error:', err?.message);
  }

  formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  async process(job: Job<{ exportJobId: string }>) {
    const USE_SAS_EXPIRING_URLS = false;

    console.log('ExportsProcessor picked job v2:', job.id, job.data);

    const exportJob = await this.exportsService.findById(job.data.exportJobId);
    if (!exportJob) throw new Error('Export job not found v2');

    await this.exportsService.markProcessing(exportJob.id);

    // Local workspace on disk for processing large files
    const tmpDir = path.join(process.cwd(), 'tmp-exports');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const excelFilePath = path.join(tmpDir, `va_data_${exportJob.id}.xlsx`);
    const zipFilePath = path.join(tmpDir, `filteredData-${exportJob.id}.zip`);

    try {
      const rawFilters = exportJob.filtersJson ?? {};
      console.log(
        'Occurrence Ids scheduled length: ',
        exportJob.occurrence_ids?.length?.toString() ?? '0',
      );

      // 1. FILTER SANITIZATION
      const sanitizedFilters = this.sanitizeFilters(rawFilters);

      console.log(
        'Final Sanitized Filters for Service:',
        JSON.stringify(sanitizedFilters),
      );

      const take = config.get('dataExportBatchSize');
      const yieldAfter = config.get('dataExportYieldAfter')
      const saveToDisk = true; // CRITICAL: Forces ExcelJS streaming writer to write straight to disk

      // 2. STREAM EXCEL DIRECTLY TO DISK
      await this.dynamicExportService.exportAllToExcelBackground(
        sanitizedFilters,
        RAW_TEMPLATE_FIELD_MAPPING,
        excelFilePath, // Output file target
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

      // 3. STREAM DISK EXCEL FILE INTO DISK ZIP ARCHIVE (Archiver)
      await this.createZipFileOnDisk(excelFilePath, zipFilePath);
      await this.exportsService.updateProgress(exportJob.id, 90);

      // 4. STREAM ZIP ARCHIVE DIRECTLY TO AZURE BLOB STORAGE
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

      // 5. MARK COMPLETED
      await this.exportsService.updateProgress(exportJob.id, 100);
      await this.exportsService.markCompleted(exportJob.id, blobPath, fileName);

      // 6. SEND EMAIL NOTIFICATION
      if (exportJob.downloaderEmail) {
        // Re-fetch export job to get the DOI (which was created during Excel generation)
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
        const emailBody = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #2e7d32;">Your Data Export is Ready</h2>
            <p>Hello ${updatedExportJob.downloaderName || 'User'},</p>
            <p>The VectorAtlas data export you requested has been processed successfully!</p>
            <p>Note that the download link will <span style="color:rgb(251,51,51)"> expire after 3 days.</span> </p>
            <p>
              Kindly cite this dataset as follows: The Vector Atlas DataBase (VADB) downloaded ${dateDownloaded}, https://vectoratlas.icipe.org/, DOI: https://doi.org/10.60798/DSVG-T752. (please ensure original data sources are maintained)
            </p>
            <div style="margin: 25px 0;">
              <a href="${uploadedFileUrl}" 
                 style="background-color: #2e7d32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Download ZIP File
              </a>
            </div>

            <!-- DOI Section -->
            ${updatedExportJob.doi && updatedExportJob.doi.doi_link
            ? `
            <p>Your dataset has been assigned a DOI:</p>
            <p>
              <a href="${updatedExportJob.doi.doi_link}" target="_blank" style="color: #2e7d32; text-decoration: none; font-weight: bold;">
                ${updatedExportJob.doi.doi_id}
              </a>
            </p>
            `
            : ''
          }

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

        console.log(
          `Notification email sent to ${maskEmail(
            updatedExportJob.downloaderEmail,
          )}`,
        );
      }

      console.log('Marked completed v2:', exportJob.id);
    } catch (error: any) {
      console.error('Processor failed for job v2:', exportJob.id, error);
      await this.exportsService.markFailed(
        exportJob.id,
        error?.message ?? 'Unknown error',
      );
      throw error;
    } finally {
      // 7. CLEANUP TEMPORARY FILES FROM DISK
      if (fs.existsSync(excelFilePath)) fs.unlinkSync(excelFilePath);
      if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
    }
  }

  /**
   * Compress file on disk using streams without loading into memory
   */
  // private createZipFileOnDisk(
  //   sourceFilePath: string,
  //   targetZipPath: string,
  // ): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const output = fs.createWriteStream(targetZipPath);
  //     const archive = (archiver as any)('zip', { zlib: { level: 6 } });
  //
  //     output.on('close', () => resolve());
  //     archive.on('error', (err) => reject(err));
  //
  //     archive.pipe(output);
  //     archive.file(sourceFilePath, { name: `va_data_${Date.now()}.xlsx` });
  //     archive.finalize();
  //   });
  // }

  // private createZipFileOnDisk(
  //   sourceFilePath: string,
  //   targetZipPath: string,
  // ): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     // 1. Create disk write stream for the output ZIP file
  //     const outputStream = fs.createWriteStream(targetZipPath);
  //
  //     // 2. Initialize archiver
  //     const archive = archiver('zip', { zlib: { level: 6 } });
  //
  //     // Handle stream completion and errors
  //     outputStream.on('close', () => {
  //       console.log(`ZIP complete. File size: ${archive.pointer()} total bytes`);
  //       resolve();
  //     });
  //     archive.on('error', (err: any) => reject(err));
  //
  //     // 3. Pipe archive data straight to the output disk stream
  //     archive.pipe(outputStream);
  //
  //     // 4. Stream the source Excel file from disk into the archive (DO NOT USE fs.readFileSync)
  //     const fileReadStream = fs.createReadStream(sourceFilePath);
  //     archive.append(fileReadStream, { name: `va_data_${Date.now()}.xlsx` });
  //
  //     // 5. Finalize the stream
  //     archive.finalize();
  //   });
  // }

  // private createZipFileOnDisk(
  //   sourceFilePath: string,
  //   targetZipPath: string,
  // ): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const zip = new JSZip();
  //
  //     // 1. Read the Excel file as a ReadStream directly from disk
  //     const fileStream = fs.createReadStream(sourceFilePath);
  //
  //     // 2. Add the stream to JSZip (JSZip will read chunk-by-chunk)
  //     zip.file(`va_data_${Date.now()}.xlsx`, fileStream);
  //
  //     // 3. Create a WriteStream for the output ZIP file on disk
  //     const outputStream = fs.createWriteStream(targetZipPath);
  //
  //     // 4. Generate Node Stream with streamFiles enabled
  //     zip
  //       .generateNodeStream({
  //         type: 'nodebuffer',
  //         streamFiles: true, // CRITICAL: Streams file chunks to prevent loading entire archive into RAM
  //         compression: 'DEFLATE',
  //         compressionOptions: { level: 6 },
  //       })
  //       .pipe(outputStream)
  //       .on('finish', () => {
  //         console.log('ZIP stream written to disk successfully.');
  //         resolve();
  //       })
  //       .on('error', (err) => {
  //         console.error('ZIP streaming failed:', err);
  //         reject(err);
  //       });
  //   });
  // }

  private createZipFileOnDisk(
    sourceFilePath: string,
    targetZipPath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const zip = new JSZip();

      // 1. Read Excel file stream from disk
      const fileStream = fs.createReadStream(sourceFilePath);

      // 2. Attach stream to JSZip
      zip.file(`va_data_${Date.now()}.xlsx`, fileStream);

      // 3. Add the Vector Atlas Data Guide document from config
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
        console.warn(
          `Vector Atlas Database Guide document not found at: ${guideDocPath}`,
        );
      }

      // 4. Create destination write stream
      const outputStream = fs.createWriteStream(targetZipPath);

      // 4. Listen for completion on the output write stream!
      // Listening to outputStream 'finish' ensures the file handle is completely closed on disk
      outputStream.on('finish', () => {
        console.log('ZIP output stream finished flushing to disk.');
        resolve();
      });

      outputStream.on('error', (err) => {
        console.error('Error writing ZIP file to disk:', err);
        reject(err);
      });

      // 5. Pipe ZIP generator to disk write stream
      zip
        .generateNodeStream({
          type: 'nodebuffer',
          streamFiles: true,
          compression: 'DEFLATE',
          compressionOptions: { level: 6 },
        })
        .pipe(outputStream)
        .on('error', (err) => {
          console.error('Error in JSZip node stream:', err);
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

      // Handle nested timeRange object from frontend
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
        // Include all other filters as-is
        sanitizedFilters[key] = val;
      }
    }
    return sanitizedFilters;
  }
}
