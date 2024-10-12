import { Injectable, Logger } from '@nestjs/common';
import { UploadedDataset } from '../db/uploaded-dataset/entities/uploaded-dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class DatasetUploadService {
  constructor(
    @InjectRepository(UploadedDataset)
    private datasetRepository: Repository<UploadedDataset>,
    private logger: Logger,
  ) {}

  async validUser(datasetId, userId): Promise<boolean> {
    return (
      (
        await this.datasetRepository.findAndCount({
          where: {
            id: datasetId,
            owner: userId,
          },
        })
      )[1] > 0
    );
  }

  async validDataset(datasetId): Promise<boolean> {
    return (
      (
        await this.datasetRepository.findAndCount({
          where: {
            id: datasetId,
          },
        })
      )[1] > 0
    );
  }

  async doiExists(doi, datasetId): Promise<boolean> {
    if (datasetId) {
      return (
        (
          await this.datasetRepository.findAndCount({
            where: {
              provided_doi: doi,
              id: Not(datasetId),
            },
          })
        )[1] > 0
      );
    }
    return (
      (
        await this.datasetRepository.findAndCount({
          where: {
            provided_doi: doi,
          },
        })
      )[1] > 0
    );
  }
}
