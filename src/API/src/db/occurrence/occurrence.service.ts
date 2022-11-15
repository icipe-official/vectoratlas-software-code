import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Brackets, Repository } from 'typeorm';
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
    filters: OccurrenceFilter,
    paginated: boolean,
  ): Promise<{ items: Occurrence[]; total: number }> {
    let query = this.occurrenceRepository
      .createQueryBuilder('occurrence')
      .orderBy('occurrence.id')
      .leftJoinAndSelect('occurrence.sample', 'sample')
      .leftJoinAndSelect('occurrence.site', 'site')
      .leftJoinAndSelect('occurrence.recordedSpecies', 'recordedSpecies')
      .leftJoinAndSelect('occurrence.bionomics', 'bionomics')
      .leftJoinAndSelect('recordedSpecies.species', 'species');

    if (filters) {
      if (filters.country) {
        query = query.andWhere('"site"."country" = :country', {
          country: filters.country,
        });
      }
      if (filters.species) {
        query = query.andWhere('"species"."species" = :species', {
          species: filters.species,
        });
      }
      if (filters.isLarval !== (null || undefined)) {
        query = query.andWhere('"bionomics"."larval_site_data" = :isLarval', {
          isLarval: filters.isLarval,
        });
      }
      if (filters.isAdult !== (null || undefined)) {
        query = query.andWhere('"bionomics"."adult_data" = :isAdult', {
          isAdult: filters.isAdult,
        });
      }
      if (filters.control !== (null || undefined)) {
        query = query.andWhere('"sample"."control" = :isControl', {
          isControl: filters.control,
        });
      }
      if (filters.season) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"bionomics"."season_given" = :season', {
              season: filters.season,
            }).orWhere('"bionomics"."season_calc" = :season', {
              season: filters.season,
            });
          }),
        );
      }
      if (filters.startTimestamp) {
        const startTime = new Date(filters.startTimestamp);
        query = query.andWhere(
          '"occurrence"."timestamp_end" >= :startTimestamp',
          { startTimestamp: startTime },
        );
      }
      if (filters.endTimestamp) {
        const endTime = new Date(filters.endTimestamp);
        query = query.andWhere(
          '"occurrence"."timestamp_start" < :endTimestamp',
          { endTimestamp: endTime },
        );
      }
    }

    // eslint-disable-next-line max-len
    const [items, total] = paginated
      ? await query.skip(skip).take(take).getManyAndCount()
      : await query.getManyAndCount();
    return { items, total };
  }
}
