import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Repository } from 'typeorm';
import { OccurrenceFilter } from './occurrence.resolver';

@Injectable()
export class OccurrenceService {
  constructor(
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
  ) {}

  findOneById(id: string): Promise<Occurrence> {
    return this.occurrenceRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Occurrence[]> {
    return this.occurrenceRepository.find({
      relations: ['site', 'sample', 'recordedSpecies'],
    });
  }

  async findOccurrences(
    take: number,
    skip: number,
    filters: OccurrenceFilter
  ): Promise<{ items: Occurrence[]; total: number }> {
    let query = this.occurrenceRepository
      .createQueryBuilder('occurrence')
      .orderBy('occurrence.id')
      .leftJoinAndSelect('occurrence.sample', 'sample')
      .leftJoinAndSelect('occurrence.site', 'site')
      .leftJoinAndSelect('occurrence.recordedSpecies', 'recordedSpecies')
      .leftJoinAndSelect('recordedSpecies.species', 'species');

    if (filters) {
      if (filters.country) {
        query = query.andWhere('\"site\".\"country\" = :country', {country: filters.country})
      }
      if (filters.species) {
        query = query.andWhere('\"species\".\"species\" = :species', {species: filters.species})
      }
      if (filters.isLarval !== (null || undefined)) {
        query = query.andWhere('\"species\".\"species\" = :species', {species: filters.species})
      }
    }

    const [items, total] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { items, total };
  }
}
