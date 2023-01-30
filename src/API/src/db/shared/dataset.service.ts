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

  findOneById(id: string): Promise<Dataset> {
    return this.datasetRepository.findOne({
      where: { id: id },
    });
  }
}
