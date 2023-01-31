import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Dataset)
        private datasetRepository: Repository<Dataset>
    ){}

    async reviewDataset(datasetId: string, reviewFeedback:string){

    }

    async validUser(datasetId, userId): Promise<boolean> {
        return (
          (
            await this.datasetRepository.findAndCount({
              where: {
                id: datasetId,
                ReviewedBy: userId,
              },
            })
          )[1] > 0
        );
      }

    async reviewedDataset(datasetId): Promise<boolean> {
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
}
