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
  async create(uploadedDatasetLog: UploadedDatasetLog) {
    return await this.uploadedDataLogRepository.save(uploadedDatasetLog);
  }

  async getUploadDatasetLogs() {
    return await this.uploadedDataLogRepository.find();
  }

  async getUploadDatasetLog(id: string) {
    return await this.uploadedDataLogRepository.findOne({ where: { id } });
  }

  async getUploadDatasetLogByDataset(datasetId: string) {
    return await this.uploadedDataLogRepository.findOne({
      where: { uploaded_dataset: { id: datasetId } },
    });
  }

  async update(id: string, uploadedDatasetLog: UploadedDatasetLog) {
    const res = await this.getUploadDatasetLog(id);
    if (res) {
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
}
