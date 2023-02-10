import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Brackets, In, Repository } from 'typeorm';
import { OccurrenceFilter } from './occurrence.resolver';
import { Site } from '../shared/entities/site.entity';

export interface Bounds {
  locationWindowActive: boolean;
  coords?: { lat: number; long: number }[];
}

@Injectable()
export class OccurrenceService {
  constructor(
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  findOneById(id: string): Promise<Occurrence> {
    return this.occurrenceRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Occurrence[]> {
    return this.occurrenceRepository.find({
      relations: ['site', 'sample', 'recordedSpecies'],
    });
  }

  findAllApproved(): Promise<Occurrence[]> {
    return this.occurrenceRepository.find({
      relations: ['site', 'sample', 'recordedSpecies', 'dataset'],
      where: { dataset: { status: 'Approved' } },
    });
  }

  async findOccurrencesByIds(selectedIds: string[]): Promise<Occurrence[]> {
    return this.occurrenceRepository.find({
      where: { id: In(selectedIds) },
      relations: ['reference', 'sample', 'recordedSpecies', 'bionomics'],
    });
  }

  async findSitesWithinBounds(bounds: Bounds): Promise<any> {
    const siteIds = await this.siteRepository.query(
      // eslint-disable-next-line max-len
      `SELECT id FROM site as s WHERE ST_Contains(ST_GEOMFROMEWKT('SRID=4326;POLYGON((${bounds.coords.map(
        (coord) => `${coord.long} ${coord.lat}`,
      )}, ${bounds.coords[0].long} ${bounds.coords[0].lat}))'), s.location)`,
    );
    return siteIds;
  }

  async incrementDownload(items: Occurrence[]) {
    return this.occurrenceRepository.increment(
      { id: In(items.map((i) => i.id)) },
      'download_count',
      1,
    );
  }

  async incrementAllDownload() {
    await this.occurrenceRepository.query(
      // eslint-disable-next-line max-len
      'UPDATE occurrence SET download_count = occurrence.download_count + 1 FROM dataset WHERE dataset.status = \'Approved\' AND occurrence."datasetId" = dataset.id;',
    );
  }

  async findOccurrences(
    take: number,
    skip: number,
    filters: OccurrenceFilter,
    bounds: Bounds,
  ): Promise<{ items: Occurrence[]; total: number }> {

    console.log(filters)

    const selectedLocationsIds = {
      siteIds: bounds.locationWindowActive
        ? (await this.findSitesWithinBounds(bounds)).map(function (obj: {
            id: string;
          }) {
            return obj.id;
          })
        : [],
    };

    if (
      bounds.locationWindowActive &&
      selectedLocationsIds.siteIds.length === 0
    ) {
      return { items: [], total: 0 };
    }

    let query = this.occurrenceRepository
      .createQueryBuilder('occurrence')
      .orderBy('occurrence.id')
      .leftJoinAndSelect('occurrence.sample', 'sample')
      .leftJoinAndSelect('occurrence.site', 'site')
      .leftJoinAndSelect('occurrence.recordedSpecies', 'recordedSpecies')
      .leftJoinAndSelect('occurrence.dataset', 'dataset')
      .leftJoinAndSelect('occurrence.bionomics', 'bionomics')

    query.where('"dataset"."status" = \'Approved\'');

    if (bounds.locationWindowActive) {
      query.andWhere(
        'occurrence.siteId IN (:...siteIds)',
        selectedLocationsIds,
      );
    }

    if (filters) {
      if (filters.country) {
        query = query.andWhere('"site"."country" IN (:...country)', {
          country: filters.country,
        });
      }
      if (filters.species) {
        query = query.andWhere('"recordedSpecies"."species" IN (:...species)', {
          species: filters.species,
        });
      }
      if (filters.insecticide !== (null || undefined)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"bionomics"."ir_data" IN (:...insecticide)', {
              insecticide: filters.insecticide,
            }).orWhere('"occurrence"."ir_data" IN (:...insecticide)', {
              insecticide: filters.insecticide,
            });
            if (filters.insecticide.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.isLarval !== (null || undefined)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"bionomics"."larval_site_data" IN (:...isLarval)', {
              isLarval: filters.isLarval,
            });
            if (filters.isLarval.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.isAdult !== (null || undefined)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"bionomics"."adult_data" IN (:...isAdult)', {
              isAdult: filters.isAdult,
            });
            if (filters.isAdult.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.control !== (null || undefined)) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"sample"."control" IN (:...isControl)', {
              isControl: filters.control,
            });
            if (filters.control.includes(null)) {
              qb.orWhere('"sample"."control" IS NULL');
            }
          }),
        );
      }
      if (filters.season) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"bionomics"."season_given" IN (:...season)', {
              season: filters.season,
            }).orWhere('"bionomics"."season_calc" IN (:...season)', {
              season: filters.season,
            });
            if (filters.season.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
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
    console.log(await query.skip(skip).take(take).getManyAndCount())

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();
    return { items, total };
  }
}
