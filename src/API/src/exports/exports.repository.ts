import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ExportJob } from './export-job.entity';

@Injectable()
export class ExportsRepository {
  constructor(
    @InjectRepository(ExportJob)
    private readonly repo: Repository<ExportJob>,
  ) {}

  async createAndSave(data: Partial<ExportJob>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: {
        doi: true,
      },
    });
  }

  async findByBlobPath(blobPath: string) {
    return this.repo.findOne({
      where: { blobPath: blobPath },
      relations: {
        doi: true,
      },
    });
  }

  async findReusableByHash(requestHash: string) {
    return this.repo.findOne({
      where: {
        requestHash,
        status: In(['queued', 'processing', 'completed']),
      },
      order: { creation: 'DESC' },
    });
  }

  /**
   * Find a job by the client-generated request ID.
   * Used for idempotency: if a POST succeeded on the server but the
   * response was lost (e.g. envoy 504), a retry with the same
   * clientRequestId finds the existing job instead of creating a zombie.
   */
  async findByClientRequestId(clientRequestId: string) {
    return this.repo.findOne({
      where: { clientRequestId },
      order: { creation: 'DESC' },
    });
  }

  /**
   * Find a reusable completed job by content hash.
   * Only matches completed jobs that still have a blobPath (file not
   * yet cleaned up). Used for cross-user reuse when two users export
   * the exact same set of occurrence IDs (sorted hash matches).
   */
  async findReusableByContentHash(contentHash: string) {
    return this.repo.findOne({
      where: {
        contentHash,
        status: 'completed',
      },
      order: { creation: 'DESC' },
    });
  }

  async markProcessing(id: string) {
    await this.repo.update(id, {
      status: 'processing',
      startedAt: new Date(),
    });
  }

  async updateProgress(id: string, progress: number) {
    await this.repo.update(id, { progress });
  }

  async markCompleted(id: string, blobPath: string, fileName: string) {
    await this.repo.update(id, {
      status: 'completed',
      progress: 100,
      blobPath,
      fileName,
      completedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  async markFailed(id: string, errorMessage: string) {
    await this.repo.update(id, {
      status: 'failed',
      errorMessage,
    });
  }

  async markExpired(id: string) {
    await this.repo.update(id, {
      status: 'expired',
      errorMessage: `Auto-marked as expired by blob cleanup service at ${new Date().toISOString()}`,
    });
  }
}
