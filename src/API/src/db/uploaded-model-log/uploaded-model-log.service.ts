import { Injectable } from '@nestjs/common';
import { UploadedModelLog } from './entities/uploaded-model-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UploadedModelLogService {
  constructor(
    @InjectRepository(UploadedModelLog)
    private uploadedModelLogRepository: Repository<UploadedModelLog>,
  ) {}
  async create(uploadedDatasetLog: UploadedModelLog, userId: string) {
    uploadedDatasetLog.owner = userId;
    uploadedDatasetLog.updater = userId;
    return await this.uploadedModelLogRepository.save(uploadedDatasetLog);
  }

  async getUUploadedModelLogs() {
    return await this.uploadedModelLogRepository.find({
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUUploadedModelLog(id: string) {
    return await this.uploadedModelLogRepository.findOne({ where: { id } });
  }

  async getUUploadedModelLogByDataset(modelId: string) {
    return await this.uploadedModelLogRepository.findOne({
      where: { uploaded_model: { id: modelId } },
      order: {
        modified: 'DESC',
      },
    });
  }

  async update(
    id: string,
    uploadedDatasetLog: UploadedModelLog,
    userId: string,
  ) {
    const res = await this.getUUploadedModelLog(id);
    if (res) {
      uploadedDatasetLog.updater = userId;
      return await this.uploadedModelLogRepository.save(uploadedDatasetLog);
    }
    return null;
  }

  async remove(id: string) {
    const res = await this.getUUploadedModelLog(id);
    if (res) {
      return await this.uploadedModelLogRepository.remove(res);
    }
    return null;
  }
}
