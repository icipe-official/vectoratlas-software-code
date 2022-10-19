import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  findOneById(id: string): Promise<Species> {
    return this.speciesRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Species[]> {
    return this.speciesRepository.find();
  }
}
