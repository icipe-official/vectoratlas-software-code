import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dataset } from './entities/dataset.entity';

@Injectable()
export class DatasetService {
    constructor(
        @InjectRepository(Dataset)
        private readonly dataSetRepository: Repository<Dataset>
      ) {}

      findByBionomicsDatasetById(id: string): Promise<Dataset[]> {
        return this.dataSetRepository.find({ where: { id: id },relations: ['bionomics'] })
      }

      findOccurrenceDatasetById(id: string): Promise<Dataset[]> {
        return this.dataSetRepository.find({ where: { id: id },relations: ['occurrence'] })
      }

}
