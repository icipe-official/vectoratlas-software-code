import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    private authService: AuthService,
  ) {}

  async findOneById(id: string): Promise<Dataset> {
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
      relations: [],
    });

    if (dataset) {
      dataset.UpdatedBy = dataset.UpdatedBy
        ? await this.authService.getEmailFromUserId(dataset.UpdatedBy)
        : 'N/A';
      dataset.ApprovedBy = await Promise.all(
        dataset.ApprovedBy.map(
          async (item) => await this.authService.getEmailFromUserId(item),
        ),
      );
      dataset.ReviewedBy = await Promise.all(
        dataset.ReviewedBy.map(
          async (item) => await this.authService.getEmailFromUserId(item),
        ),
      );
    }

    return dataset;
  }
  async findOneByIdWithChildren(id: string): Promise<any> {
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
      relations: [],
    });
    const datasetwithbionomics = await this.datasetRepository.findOne({
      where: { id: id },
      relations: ['bionomics'],
    });
    const datasetwithoccurrence = await this.datasetRepository.findOne({
      where: { id: id },
      relations: ['occurrence'],
    });
    dataset.bionomics = datasetwithbionomics.bionomics;
    dataset.occurrence = datasetwithoccurrence.occurrence;

    return dataset;
  }
}
