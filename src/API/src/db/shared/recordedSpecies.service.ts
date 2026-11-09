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
    const { id, species, species_notes, species_id_1, species_id_2 } = input;

    const recorded = await this.recordedSpeciesRepository.findOne({
      where: { id },
    });
    if (!recorded) {
      throw new Error(`Recorded species entry with ID ${id} not found.`);
    }
    if (species !== undefined) recorded.species = species;
    if (species_notes !== undefined) recorded.species_notes = species_notes;
    if (species_id_1 !== undefined) recorded.species_id_1 = species_id_1;
    if (species_id_2 !== undefined) recorded.species_id_2 = species_id_2;

    return await this.recordedSpeciesRepository.save(recorded);
  }
}
