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

  async create(species: Species) {
    return await this.speciesRepository.save(species);
  }

  async findAll() {
    return await this.speciesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    return await this.speciesRepository.findOne({
      where: { id: id },
      relations: ['recorded_species'],
    });
  }

  async findByName(name: string) {
    return await this.speciesRepository.findOne({
      where: { name: name },
    });
  }

  async update(id: string, species: Partial<Species>) {
    const res = await this.findOne(id);
    if (res) {
      species.id = id;
      return await this.speciesRepository.save(species);
    }
    return null;
  }
}
