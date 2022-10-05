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
    return this.occurrenceRepository.find({ relations: ['site', 'sample'] });
  }

  async findLocations(take:number, skip:number): Promise<{items:Occurrence[], total: number}> {
    const [items, total] =  await this.occurrenceRepository.createQueryBuilder('occurrence')
    //.loadAllRelationIds({relations: ['site', 'sample']}) // <== investigate if this is duplicating location and n_all
    .orderBy('occurrence.id')
    .leftJoinAndSelect('occurrence.sample', 'sample')
    .leftJoinAndSelect('occurrence.site', 'site')
    .skip(skip)
    .take(take)
    .getManyAndCount()
    console.log(items, total)
    return {items, total}
  }
}

