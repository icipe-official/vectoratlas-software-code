import { EditLogsService } from './../edit-logs/editLogs.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Occurrence } from './entities/occurrence.entity';
import { Brackets, In, Repository } from 'typeorm';
import { OccurrenceFilter } from './occurrence.resolver';
import { Site } from '../shared/entities/site.entity';
import { Sample } from './entities/sample.entity';
import { Reference } from '../shared/entities/reference.entity';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { Bionomics } from '../bionomics/entities/bionomics.entity';
import { Dataset } from '../shared/entities/dataset.entity';
import { InsecticideResistanceBioassays } from '../insecticideResistance/entities/insecticideResistanceBioassays.entity';
import { Rdl296GenotypeFrequencies } from '../insecticideResistance/entities/rdl296GenotypeFrequencies.entity';
import { EditLog } from '../edit-logs/editLog.entity';

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
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,
    @InjectRepository(RecordedSpecies)
    private speciesRepository: Repository<RecordedSpecies>,
    @InjectRepository(Bionomics)
    private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    @InjectRepository(InsecticideResistanceBioassays)
    private insecticideResistanceBioassaysRepository: Repository<InsecticideResistanceBioassays>,
    @InjectRepository(Rdl296GenotypeFrequencies)
    private rdl296GenotypeFrequenciesRepository: Repository<Rdl296GenotypeFrequencies>,
    private readonly editLogsService: EditLogsService,
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

  getRepositoryByEntityType(entityType: string): Repository<any> {
    switch (entityType) {
      case 'recordedSpecies':
        return this.speciesRepository;
      case 'occurrence':
        return this.occurrenceRepository;
      case 'sample':
        return this.sampleRepository;
      case 'reference':
        return this.referenceRepository;
      case 'site':
        return this.siteRepository;
      case 'dataset':
        return this.datasetRepository;
      case 'bionomics':
        return this.bionomicsRepository;
      case 'insecticideResistanceBioassays':
        return this.insecticideResistanceBioassaysRepository;
      case 'rdl296GenotypeFrequencies':
        return this.rdl296GenotypeFrequenciesRepository;
      default:
        return null;
    }
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
        (coord) => `${coord.lat} ${coord.long}`,
      )}, ${bounds.coords[0].lat} ${bounds.coords[0].long}))'), s.location)`,
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

  /**
   * Get all fields for relations associated with Occurrence Entity
   */
  getOccurrenceFields(includeRelated = false): object {
    const columns = this.occurrenceRepository.metadata.columns.map(
      (col) => col.propertyName,
    );
    const fields = { occurrence: columns };
    if (includeRelated) {
      const related = this.getOccurrenceRelatedFields();
      Object.assign(fields, related);
    }
    return fields;
  }

  /**
   * Get relations linked to occurrence entity
   * @returns
   */
  getOccurrenceRelatedFields() {
    const fields = {};
    this.occurrenceRepository.metadata.relations.map((relation) => {
      const cols = relation.inverseEntityMetadata.columns.map(
        (col) => col.propertyName,
      );
      Object.assign(fields, { [relation.propertyName]: cols });
    });
    return fields;
  }

  async findOccurrences(
    take: number,
    skip: number,
    filters: OccurrenceFilter,
    bounds: Bounds,
    minimalFields = true,
  ): Promise<{ items: Occurrence[]; total: number }> {
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
      .leftJoinAndSelect('occurrence.dataset', 'dataset')
      .leftJoinAndSelect('occurrence.site', 'site')
      .leftJoinAndSelect('occurrence.recordedSpecies', 'recordedSpecies')
      .addSelect('occurrence.binary_presence');

    if (!minimalFields) {
      query
        .leftJoinAndSelect('occurrence.reference', 'reference')
        // .leftJoinAndSelect('occurrence.bionomics', 'bionomics')
        .leftJoinAndSelect(
          'occurrence.insecticideResistanceBioassays',
          'insecticideResistanceBioassays',
        );
    }

    query.where('"dataset"."status" = \'Approved\'');

    if (bounds.locationWindowActive) {
      query.andWhere(
        'occurrence.siteId IN (:...siteIds)',
        selectedLocationsIds,
      );
    }
    if (filters && Object.keys(filters).length !== 0) {
      query = query
        .leftJoinAndSelect('occurrence.sample', 'sample')
        .leftJoinAndSelect('occurrence.bionomics', 'bionomics');

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
      if (filters.bionomics !== (null || undefined)) {
        query = query.andWhere(
          new Brackets((qb) => {
            if (filters.bionomics.includes(true)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NOT NULL');
            }
            if (filters.bionomics.includes(false)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.insecticide) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"occurrence"."ir_data" IN (:...insecticide)', {
              insecticide: filters.insecticide,
            });
            qb.orWhere('"bionomics"."ir_data" IN (:...insecticide)', {
              insecticide: filters.insecticide,
            });
            if (filters.insecticide.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.binary_presence) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where(
              '"occurrence"."binary_presence" IN (:...binary_presence)',
              {
                binary_presence: filters.binary_presence,
              },
            );
            if (filters.binary_presence.includes(null)) {
              qb.orWhere('"occurrence"."bionomicsId" IS NULL');
            }
          }),
        );
      }
      if (filters.abundance_data) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"occurrence"."abundance_data" IN (:...abundance_data)', {
              abundance_data: filters.abundance_data,
            });
            if (filters.abundance_data.includes(null)) {
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

    const [items, total] = await query.skip(skip).take(take).getManyAndCount();
    return { items, total };
  }

async modifyPointData(data: any): Promise<{ status: string; occurrence: Occurrence }> {
  const { id, sample, reference, recorded_species, ...mainFields } = data;

  const occurrence = await this.occurrenceRepository.findOne({
    where: { id },
    relations: ['sample', 'reference', 'recordedSpecies'],
  });

  if (!occurrence) {
    throw new NotFoundException('Occurrence not found');
  }

  Object.assign(occurrence, mainFields);

  if (sample && occurrence.sample?.id) {
    const updatedSample = await this.sampleRepository.preload({
      id: occurrence.sample.id,
      ...sample,
    });
    if (updatedSample) occurrence.sample = updatedSample;
  }

  if (reference && occurrence.reference?.id) {
    const updatedReference = await this.referenceRepository.preload({
      id: occurrence.reference.id,
      ...reference,
    });
    if (updatedReference) occurrence.reference = updatedReference;
  }

  if (recorded_species && occurrence.recordedSpecies?.id) {
    const updatedSpecies = await this.speciesRepository.preload({
      id: occurrence.recordedSpecies.id,
      ...recorded_species,
    });
    if (updatedSpecies) occurrence.recordedSpecies = updatedSpecies;
  }

  await this.occurrenceRepository.save(occurrence);

  const updatedOccurrence = await this.occurrenceRepository.findOne({
    where: { id },
    relations: ['sample', 'reference', 'recordedSpecies', 'site', 'dataset'],
  });

  return {
    status: 'success',
    occurrence: updatedOccurrence,
  };
}


async modifyFullPointData(data: any, entityType: string, editor: any, reasonForEdit: any) {
  const repo = this.getRepositoryByEntityType(entityType);

  const dataArray = Array.isArray(data) ? data : [data];
  const results = [];

  for (const item of dataArray) {
    if (!item.id) continue;

    const existing = await repo.findOne({ where: { id: item.id } });
    if (!existing) continue;

    // Keep a copy of the initial state before changes
    const initialData = { ...existing };

    let filteredItem = { ...item };
    let retries = 0;
    let updated: any = null;

    while (retries < 3) {
      try {
        updated = Object.assign(existing, filteredItem);
        await repo.save(updated);
        break; // success
      } catch (error: any) {
        const msg = error?.message || '';

        const match = msg.match(/column "(.*?)" can only be updated to DEFAULT/);
        const fieldToRemove = match?.[1];

        if (fieldToRemove && fieldToRemove in filteredItem) {
          delete filteredItem[fieldToRemove];
          retries++;
        } else {
          break;
        }
      }
    }

    if (updated) {
      results.push({
        id: item.id,
        before: initialData,
        after: updated,
      });
    }

    await this.editLogsService.createLog(
      item.id, 
      initialData, 
      updated,    
      editor,   
      reasonForEdit || 'Automated edit via modifyFullPointData',
    );
  }

  return {
    message: 'Data updated successfully (auto fields skipped if necessary)',
    modifiedRecords: results,
  };
}



async getPointData(entityType: string, occurrenceId: string): Promise<any> {
  switch (entityType) {
    case 'occurrence': {
      const record = await this.occurrenceRepository.findOne({
        where: { id: occurrenceId },
        relations: ['sample', 'reference', 'recordedSpecies', 'site', 'dataset'],
      });
      if (!record) throw new NotFoundException('Occurrence not found');
      return record;
    }

    case 'site': {
      const records = await this.siteRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'dataset': {
      const records = await this.datasetRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'reference': {
      const records = await this.referenceRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'sample': {
      const records = await this.sampleRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'recordedSpecies': {
      const records = await this.speciesRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'bionomics': {
      const records = await this.bionomicsRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'insecticideResistanceBioassays': {
      const records = await this.insecticideResistanceBioassaysRepository.find({
        where: { occurrence: { id: occurrenceId } },
      });
      return records;
    }

    case 'rdl296GenotypeFrequencies': {
      const records = await this.rdl296GenotypeFrequenciesRepository.find({
        where: {
          insecticideResistanceBioassays: {
            occurrence: {
              id: occurrenceId,
            },
          },
        },
        relations: ['insecticideResistanceBioassays', 'insecticideResistanceBioassays.occurrence'],
      });
      return records;
    }

    default:
      throw new Error(`Unsupported entityType: ${entityType}`);
  }
}

async getPointDataBySource(source_id: string): Promise<any> {
  const records = await this.occurrenceRepository.find({
    where: { source_id },
    relations: ['sample', 'reference', 'recordedSpecies', 'site', 'dataset'],
  });

  if (!records || records.length === 0) {
    throw new NotFoundException('No occurrences found for given sourceId');
  }

  return records;
}

}
