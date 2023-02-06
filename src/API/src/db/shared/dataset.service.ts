import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
  ) {}

  async findOneById(id: string): Promise<Dataset> {
    const dataset = await this.datasetRepository.findOne({
      where: { id: id },
    });

/*     if (dataset) {
      dataset.UpdatedBy =
    } */

    return dataset;
  }
}
