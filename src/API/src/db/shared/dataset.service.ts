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
    await this.authService.init();
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
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

  async findUpdatedBy(userId: string): Promise<Dataset[]> {
    const dataset = await this.datasetRepository.find({
      where: {UpdatedBy: userId}
    });
    
    return dataset;
  }
}
