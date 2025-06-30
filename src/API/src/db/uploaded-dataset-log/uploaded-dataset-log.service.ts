import { Injectable } from '@nestjs/common';
import { UploadedDatasetLog } from './entities/uploaded-dataset-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UploadedDatasetLogService {
  constructor(
    @InjectRepository(UploadedDatasetLog)
    private uploadedDataLogRepository: Repository<UploadedDatasetLog>,
  ) {}
  async create(uploadedDatasetLog: UploadedDatasetLog, userId: string) {
    uploadedDatasetLog.owner = userId;
    uploadedDatasetLog.updater = userId;
    return await this.uploadedDataLogRepository.save(uploadedDatasetLog);
  }

  async getUploadDatasetLogs() {
    return await this.uploadedDataLogRepository.find({
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUploadDatasetLog(id: string) {
    return await this.uploadedDataLogRepository.findOne({ where: { id } });
  }

  async getUploadDatasetLogsByDataset(datasetId: string) {
    return await this.uploadedDataLogRepository.find({
      where: { uploaded_dataset: { id: datasetId } },
      order: {
        modified: 'DESC',
      },
    });
  }

  async update(
    id: string,
    uploadedDatasetLog: UploadedDatasetLog,
    userId: string,
  ) {
    const res = await this.getUploadDatasetLog(id);
    if (res) {
      uploadedDatasetLog.updater = userId;
      return await this.uploadedDataLogRepository.save(uploadedDatasetLog);
    }
    return null;
  }

  async remove(id: string) {
    const res = await this.getUploadDatasetLog(id);
    if (res) {
      return await this.uploadedDataLogRepository.remove(res);
    }
    return null;
  }

  async removeByDataset(datasetId: string) {
    const res = await this.getUploadDatasetLogsByDataset(datasetId);
    if (res) {
      return await this.uploadedDataLogRepository.remove(res);
    }
    return null;
  }
}
