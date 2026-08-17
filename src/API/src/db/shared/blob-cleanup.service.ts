import { ContainerClient } from '@azure/storage-blob';
import { Injectable, Logger } from '@nestjs/common';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExportsService } from 'src/exports/exports.service';

const AZURE_EXPORTS_DIRECTORY =
  process.env.AZURE_EXPORTS_DIRECTORY || 'exports';
@Injectable()
export class BlobCleanupService {
  private readonly logger = new Logger(BlobCleanupService.name);
  private readonly containerClient: ContainerClient;

  constructor(
    private azureBlobService: AzureBlobService,
    private exportService: ExportsService,
  ) {}

  /**
   * Delete old files in Azure-Blob
   */

  //   @Cron('0 2 * * *')// Runs every day at 2:00 am
  //   @Cron('0 * * * * *') // Run every minute
  //   @Cron(CronExpression.EVERY_MINUTE) // Run every minute
  //   @Cron(CronExpression.EVERY_6_HOURS) // Run every 6 hours
  @Cron(CronExpression.EVERY_6_HOURS) // Run every 6 hours
  async deleteOldBlobs(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 3); // Older than 3 days
    // cutoffDate.setDate(cutoffDate.getDate() - 0); // Older than today

    this.logger.log(`Deleting blobs older than ${cutoffDate.toISOString()}`);

    let deleteCount = 0;
    // const blobs = await this.azureBlobService.getAllBlobs(DOWNLOADS_CONTAINER);

    // for await (const blob of blobs) {
    // ListBlobs is more effecient than getAllBlobs. See listBlobs docstring
    for await (const blob of this.azureBlobService.listBlobs(
      AZURE_EXPORTS_DIRECTORY,
    )) {
      const lastModified = blob.properties.lastModified;

      if (!lastModified) {
        continue;
      }

      if (lastModified < cutoffDate) {
        try {
          // Check if there was a job that had this file and mark it as expired
          const exportJob = await this.exportService.findByBlobPath(blob.name);
          if (exportJob) {
            // Only delete the files present in this database and not any other
            if (exportJob.status !== 'expired') {
              this.exportService.markExpired(exportJob.id);

              await this.azureBlobService.deleteFile(blob.name);
              deleteCount++;

              this.logger.log(
                `Deleted blob: ${blob.name} (${lastModified.toISOString()})`,
              );
            }
          }
        } catch (error) {
          this.logger.error(
            `Failed to delete blob: ${blob.name}`,
            error?.stack,
          );
        }
      }
    }

    this.logger.log(`Cleanup complete. Deleted ${deleteCount} blobs.`);
  }
}
