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
