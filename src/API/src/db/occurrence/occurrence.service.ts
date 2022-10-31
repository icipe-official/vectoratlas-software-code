import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Repository } from 'typeorm';

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
  ): Promise<{ items: Occurrence[]; total: number }> {
    const [items, total] = await this.occurrenceRepository
      .createQueryBuilder('occurrence')
      .orderBy('occurrence.id')
      .leftJoinAndSelect('occurrence.sample', 'sample')
      .leftJoinAndSelect('occurrence.site', 'site')
      .leftJoinAndSelect('occurrence.recordedSpecies', 'recordedSpecies')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { items, total };
  }
}
