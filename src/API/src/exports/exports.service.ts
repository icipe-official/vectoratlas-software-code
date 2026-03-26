import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createHash } from 'crypto';
import { CreateExportDto } from './dto/create-export.dto';
import { ExportsRepository } from './exports.repository';

@Injectable()
export class ExportsService {
  constructor(
    private readonly exportsRepository: ExportsRepository,
    @InjectQueue('exports') private readonly exportsQueue: Queue
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
        })
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

    const existing = await this.exportsRepository.findReusableByHash(requestHash);

    if (existing) {
      return {
        jobId: existing.id,
        status: existing.status,
      };
    }

    const job = await this.exportsRepository.createAndSave({
      owner: userId,
      requestHash,
      status: 'queued',
      filtersJson: JSON.stringify(normalizedFilters),
      generateDoi: !!dto.generateDoi,
      downloaderName: dto.downloaderName,
      downloaderEmail: dto.downloaderEmail,
      progress: 0,
    });

    await this.exportsQueue.add(
      'generate-export',
      { exportJobId: job.id },
      { jobId: requestHash }
    );

    return {
      jobId: job.id,
      status: job.status,
    };
  }

  async getExportStatus(jobId: string) {
    const job = await this.exportsRepository.findById(jobId);
    if (!job) throw new NotFoundException('Export job not found');

    return {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      errorMessage: job.errorMessage,
      downloadUrl:
        job.status === 'completed' && job.blobPath
          ? `https://your-storage-account.blob.core.windows.net/exports/${job.blobPath}`
          : undefined,
      expiresAt: job.expiresAt,
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
