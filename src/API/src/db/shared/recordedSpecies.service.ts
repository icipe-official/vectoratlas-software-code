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
    return this.recordedSpeciesRepository.findOne({
      where: { id: id },
    });
  }

  findAll(): Promise<RecordedSpecies[]> {
    return this.recordedSpeciesRepository.find();
  }
  async update(input: any): Promise<RecordedSpecies> {
    const { id, displayName, category, color } = input;

    const species = await this.recordedSpeciesRepository.findOne({
      where: { id },
    });
    if (!species) {
      throw new Error(`Species entry with core registry ID ${id} not found.`);
    }
    if (displayName !== undefined) species.display_name = displayName;
    if (category !== undefined) species.category = category;
    if (color !== undefined) species.color = color;

    return await this.recordedSpeciesRepository.save(species);
  }
}
