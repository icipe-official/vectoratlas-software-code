import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordedSpecies } from './entities/recorded_species.entity';

@Injectable()
export class RecordedSpeciesService {
  constructor(
    @InjectRepository(RecordedSpecies)
    private recordedSpeciesRepository: Repository<RecordedSpecies>,
  ) {}

  findOneById(id: string): Promise<RecordedSpecies> {
    return this.recordedSpeciesRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<RecordedSpecies[]> {
    return this.recordedSpeciesRepository.find();
  }
}
