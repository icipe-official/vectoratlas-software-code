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
import { LarvalSite } from '../bionomics/entities/larval_site.entity';
import { Ace1AlleleFrequencies } from '../insecticideResistance/entities/ace1AlleleFrequencies.entity';
import { Ace1GenotypeFrequencies } from '../insecticideResistance/entities/ace1GenotypeFrequencies.entity';
import { Ace1MethodAndSample } from '../insecticideResistance/entities/ace1MethodAndSample.entity';
import { AnthropoZoophagic } from '../bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from '../bionomics/entities/biology.entity';
import { BitingActivity } from '../bionomics/entities/biting_activity.entity';
import { BitingRate } from '../bionomics/entities/biting_rate.entity';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { Cyp4j5AlleleFrequencies } from '../insecticideResistance/entities/cyp4j5AlleleFrequencies.entity';
import { Cyp4j5GenotypeFrequencies } from '../insecticideResistance/entities/cyp4j5GenotypeFrequencies.entity';
import { Cyp6aapAlleleFrequencies } from '../insecticideResistance/entities/cyp6aapAlleleFrequencies.entity';
import { Cyp6aapGenotypeFrequencies } from '../insecticideResistance/entities/cyp6aapGenotypeFrequencies.entity';
import { Cyp6p4AlleleFrequencies } from '../insecticideResistance/entities/cyp6p4AlleleFrequencies.entity';
import { Cyp6p4GenotypeFrequencies } from '../insecticideResistance/entities/cyp6p4GenotypeFrequencies.entity';
import { CytochromesP450_cypMethodAndSample } from '../insecticideResistance/entities/cytochromesP450_cypMethodAndSample.entity';
import { DoiSource } from '../doi-source/entities/doi-source.entity';
import { EndoExophagic } from '../bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from '../bionomics/entities/endo_exophily.entity';
import { Environment } from '../bionomics/entities/environment.entity';
import { GenotypicRepresentativeness } from '../insecticideResistance/entities/genotypicRepresentativeness.entity';
import { Gste2_114AlleleFrequencies } from '../insecticideResistance/entities/gste2_114AlleleFrequencies.entity';
import { Gste2_114GenotypeFrequencies } from '../insecticideResistance/entities/gste2_114GenotypeFrequencies.entity';
import { Gste2_119AlleleFrequencies } from '../insecticideResistance/entities/gste2_119AlleleFrequencies.entity';
import { Gste2_119GenotypeFrequencies } from '../insecticideResistance/entities/gste2_119GenotypeFrequencies.entity';
import { Infection } from '../bionomics/entities/infection.entity';
import { KdrGenotypeFrequencies } from '../insecticideResistance/entities/kdrGenotypeFrequencies.entity';
import { News } from '../news/entities/news.entity';
import { Rdl296AlleleFrequencies } from '../insecticideResistance/entities/rdl296AlleleFrequencies.entity';
import { RdlMethodAndSample } from '../insecticideResistance/entities/rdlMethodAndSample.entity';
import { SpeciesInformation } from '../speciesInformation/entities/speciesInformation.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { Vgsc1570AlleleFrequencies } from '../insecticideResistance/entities/vgsc1570AlleleFrequencies.entity';
import { Vgsc1570GenotypeFrequencies } from '../insecticideResistance/entities/vgsc1570GenotypeFrequencies.entity';
import { Vgsc402AlleleFrequencies } from '../insecticideResistance/entities/vgsc402AlleleFrequencies.entity';
import { GsteMethodAndSample } from '../insecticideResistance/entities/gsteMethodAndSample.entity';

export interface Bounds {
  locationWindowActive: boolean;
  coords?: { lat: number; long: number }[];
}

@Injectable()
export class OccurrenceService {
  constructor(
    @InjectRepository(LarvalSite)
    private larvalSiteRepository: Repository<LarvalSite>,

    @InjectRepository(Ace1AlleleFrequencies)
    private ace1AlleleFrequenciesRepository: Repository<Ace1AlleleFrequencies>,

    @InjectRepository(Ace1GenotypeFrequencies)
    private ace1GenotypeFrequenciesRepository: Repository<Ace1GenotypeFrequencies>,

    @InjectRepository(Ace1MethodAndSample)
    private ace1MethodAndSampleRepository: Repository<Ace1MethodAndSample>,

    @InjectRepository(AnthropoZoophagic)
    private anthropoZoophagicRepository: Repository<AnthropoZoophagic>,

    @InjectRepository(Biology)
    private biologyRepository: Repository<Biology>,

    @InjectRepository(Bionomics)
    private bionomicsRepository: Repository<Bionomics>,

    @InjectRepository(BitingActivity)
    private bitingActivityRepository: Repository<BitingActivity>,

    @InjectRepository(BitingRate)
    private bitingRateRepository: Repository<BitingRate>,

    @InjectRepository(CommunicationLog)
    private communicationLogRepository: Repository<CommunicationLog>,

    @InjectRepository(Cyp4j5AlleleFrequencies)
    private cyp4j5AlleleFrequenciesRepository: Repository<Cyp4j5AlleleFrequencies>,

    @InjectRepository(Cyp4j5GenotypeFrequencies)
    private cyp4j5GenotypeFrequenciesRepository: Repository<Cyp4j5GenotypeFrequencies>,

    @InjectRepository(Cyp6aapAlleleFrequencies)
    private cyp6aapAlleleFrequenciesRepository: Repository<Cyp6aapAlleleFrequencies>,

    @InjectRepository(Cyp6aapGenotypeFrequencies)
    private cyp6aapGenotypeFrequenciesRepository: Repository<Cyp6aapGenotypeFrequencies>,

    @InjectRepository(Cyp6p4AlleleFrequencies)
    private cyp6p4AlleleFrequenciesRepository: Repository<Cyp6p4AlleleFrequencies>,

    @InjectRepository(Cyp6p4GenotypeFrequencies)
    private cyp6p4GenotypeFrequenciesRepository: Repository<Cyp6p4GenotypeFrequencies>,

    @InjectRepository(CytochromesP450_cypMethodAndSample)
    private cytochromesP450CypMethodAndSampleRepository: Repository<CytochromesP450_cypMethodAndSample>,

    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,

    @InjectRepository(DoiSource)
    private doiSourceRepository: Repository<DoiSource>,

    @InjectRepository(EndoExophagic)
    private endoExophagicRepository: Repository<EndoExophagic>,

    @InjectRepository(EndoExophily)
    private endoExophilyRepository: Repository<EndoExophily>,

    @InjectRepository(Environment)
    private environmentRepository: Repository<Environment>,

    @InjectRepository(GenotypicRepresentativeness)
    private genotypicRepresentativenessRepository: Repository<GenotypicRepresentativeness>,

    @InjectRepository(Gste2_114AlleleFrequencies)
    private gste2114AlleleFrequenciesRepository: Repository<Gste2_114AlleleFrequencies>,

    @InjectRepository(Gste2_114GenotypeFrequencies)
    private gste2114GenotypeFrequenciesRepository: Repository<Gste2_114GenotypeFrequencies>,

    @InjectRepository(Gste2_119AlleleFrequencies)
    private gste2119AlleleFrequenciesRepository: Repository<Gste2_119AlleleFrequencies>,

    @InjectRepository(Gste2_119GenotypeFrequencies)
    private gste2119GenotypeFrequenciesRepository: Repository<Gste2_119GenotypeFrequencies>,

    @InjectRepository(GsteMethodAndSample)
    private gsteMethodAndSampleRepository: Repository<GsteMethodAndSample>,

    @InjectRepository(Infection)
    private infectionRepository: Repository<Infection>,

    @InjectRepository(InsecticideResistanceBioassays)
    private insecticideResistanceBioassaysRepository: Repository<InsecticideResistanceBioassays>,

    @InjectRepository(KdrGenotypeFrequencies)
    private kdrGenotypeFrequenciesRepository: Repository<KdrGenotypeFrequencies>,

    @InjectRepository(News)
    private newsRepository: Repository<News>,

    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,

    @InjectRepository(Rdl296AlleleFrequencies)
    private rdl296AlleleFrequenciesRepository: Repository<Rdl296AlleleFrequencies>,

    @InjectRepository(Rdl296GenotypeFrequencies)
    private rdl296GenotypeFrequenciesRepository: Repository<Rdl296GenotypeFrequencies>,

    @InjectRepository(RdlMethodAndSample)
    private rdlMethodAndSampleRepository: Repository<RdlMethodAndSample>,

    @InjectRepository(RecordedSpecies)
    private speciesRepository: Repository<RecordedSpecies>,

    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,

    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,

    @InjectRepository(Site)
    private siteRepository: Repository<Site>,

    @InjectRepository(SpeciesInformation)
    private speciesInformationRepository: Repository<SpeciesInformation>,

    @InjectRepository(UploadedDataset)
    private uploadedDatasetRepository: Repository<UploadedDataset>,

    @InjectRepository(UploadedDatasetLog)
    private uploadedDatasetLogRepository: Repository<UploadedDatasetLog>,

    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,

    @InjectRepository(Vgsc1570AlleleFrequencies)
    private vgsc1570AlleleFrequenciesRepository: Repository<Vgsc1570AlleleFrequencies>,

    @InjectRepository(Vgsc1570GenotypeFrequencies)
    private vgsc1570GenotypeFrequenciesRepository: Repository<Vgsc1570GenotypeFrequencies>,

    @InjectRepository(Vgsc402AlleleFrequencies)
    private vgsc402AlleleFrequenciesRepository: Repository<Vgsc402AlleleFrequencies>,

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
      case 'Larval_site':
        return this.larvalSiteRepository;
      case 'ace1AlleleFrequencies':
        return this.ace1AlleleFrequenciesRepository;
      case 'ace1GenotypeFrequencies':
        return this.ace1GenotypeFrequenciesRepository;
      case 'ace1MethodAndSample':
        return this.ace1MethodAndSampleRepository;
      case 'anthropo_zoophagic':
        return this.anthropoZoophagicRepository;
      case 'biology':
        return this.biologyRepository;
      case 'bionomics':
        return this.bionomicsRepository;
      case 'biting_activity':
        return this.bitingActivityRepository;
      case 'biting_rate':
        return this.bitingRateRepository;
      case 'communication_log':
        return this.communicationLogRepository;
      case 'cyp4j5AlleleFrequencies':
        return this.cyp4j5AlleleFrequenciesRepository;
      case 'cyp4j5GenotypeFrequencies':
        return this.cyp4j5GenotypeFrequenciesRepository;
      case 'cyp6aapAlleleFrequencies':
        return this.cyp6aapAlleleFrequenciesRepository;
      case 'cyp6aapGenotypeFrequencies':
        return this.cyp6aapGenotypeFrequenciesRepository;
      case 'cyp6p4AlleleFrequencies':
        return this.cyp6p4AlleleFrequenciesRepository;
      case 'cyp6p4GenotypeFrequencies':
        return this.cyp6p4GenotypeFrequenciesRepository;
      case 'cytochromesP450_cypMethodAndSample':
        return this.cytochromesP450CypMethodAndSampleRepository;
      case 'dataset':
        return this.datasetRepository;
      case 'doi_source':
        return this.doiSourceRepository;
      case 'endo_exophagic':
        return this.endoExophagicRepository;
      case 'endo_exophily':
        return this.endoExophilyRepository;
      case 'environment':
        return this.environmentRepository;
      case 'genotypicRepresentativeness':
        return this.genotypicRepresentativenessRepository;
      case 'gste2_114AlleleFrequencies':
        return this.gste2114AlleleFrequenciesRepository;
      case 'gste2_114GenotypeFrequencies':
        return this.gste2114GenotypeFrequenciesRepository;
      case 'gste2_119AlleleFrequencies':
        return this.gste2119AlleleFrequenciesRepository;
      case 'gste2_119GenotypeFrequencies':
        return this.gste2119GenotypeFrequenciesRepository;
      case 'gsteMethodAndSample':
        return this.gsteMethodAndSampleRepository;
      case 'infection':
        return this.infectionRepository;
      case 'insecticideResistanceBioassays':
        return this.insecticideResistanceBioassaysRepository;
      case 'kdrGenotypeFrequencies':
        return this.kdrGenotypeFrequenciesRepository;
      case 'news':
        return this.newsRepository;
      case 'occurrence':
        return this.occurrenceRepository;
      case 'rdl296AlleleFrequencies':
        return this.rdl296AlleleFrequenciesRepository;
      case 'rdl296GenotypeFrequencies':
        return this.rdl296GenotypeFrequenciesRepository;
      case 'rdlMethodAndSample':
        return this.rdlMethodAndSampleRepository;
      case 'recorded_species':
      case 'recordedSpecies':
        return this.speciesRepository;
      case 'reference':
        return this.referenceRepository;
      case 'sample':
        return this.sampleRepository;
      case 'site':
        return this.siteRepository;
      case 'species_information':
        return this.speciesInformationRepository;
      case 'uploaded_dataset':
        return this.uploadedDatasetRepository;
      case 'uploaded_dataset_log':
        return this.uploadedDatasetLogRepository;
      case 'user_role':
        return this.userRoleRepository;
      case 'vgsc1570AlleleFrequencies':
        return this.vgsc1570AlleleFrequenciesRepository;
      case 'vgsc1570GenotypeFrequencies':
        return this.vgsc1570GenotypeFrequenciesRepository;
      case 'vgsc402AlleleFrequencies':
        return this.vgsc402AlleleFrequenciesRepository;

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
      query = query.leftJoinAndSelect('occurrence.sample', 'sample');
      // 1. Notice the bionomics join is DELETED from here!

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

      // We can still filter by bionomicsId presence without actually joining the table
      if (filters.bionomics && filters.bionomics.length > 0) {
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
            qb.where(
              '"occurrence"."insecticide_resistance_data" IN (:...insecticide)',
              {
                insecticide: filters.insecticide,
              },
            );
            // Removed the bionomics OR check, and fixed the null fallback
            if (filters.insecticide.includes(null)) {
              qb.orWhere('"occurrence"."insecticide_resistance_data" IS NULL');
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
              qb.orWhere('"occurrence"."binary_presence" IS NULL');
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
              qb.orWhere('"occurrence"."abundance_data" IS NULL');
            }
          }),
        );
      }

      // 2. Repointed isLarval to the occurrence table
      if (filters.isLarval && filters.isLarval.length > 0) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"occurrence"."larval_data" IN (:...isLarval)', {
              isLarval: filters.isLarval,
            });
            if (filters.isLarval.includes(null)) {
              qb.orWhere('"occurrence"."larval_data" IS NULL');
            }
          }),
        );
      }
      // 3. Repointed isAdult to the occurrence table (using abundance_data)
      if (filters.isAdult && filters.isAdult.length > 0) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"occurrence"."abundance_data" IN (:...isAdult)', {
              isAdult: filters.isAdult,
            });
            if (filters.isAdult.includes(null)) {
              qb.orWhere('"occurrence"."abundance_data" IS NULL');
            }
          }),
        );
      }

      if (filters.control && filters.control.length > 0) {
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

      // 4. Repointed Season to the occurrence table
      if (filters.season) {
        query = query.andWhere(
          new Brackets((qb) => {
            qb.where('"occurrence"."season_given" IN (:...season)', {
              season: filters.season,
            }).orWhere('"occurrence"."season_calc" IN (:...season)', {
              season: filters.season,
            });
            if (filters.season.includes(null)) {
              qb.orWhere(
                '"occurrence"."season_given" IS NULL AND "occurrence"."season_calc" IS NULL',
              );
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

  async modifyPointData(
    data: any,
  ): Promise<{ status: string; occurrence: Occurrence }> {
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

  async modifyFullPointData(
    data: any,
    entityType: string,
    editor: any,
    reasonForEdit: any,
  ) {
    const repo = this.getRepositoryByEntityType(entityType);

    const dataArray = Array.isArray(data) ? data : [data];
    const results = [];

    for (const item of dataArray) {
      if (!item.id) continue;

      const existing = await repo.findOne({ where: { id: item.id } });
      if (!existing) continue;

      // Keep a copy of the initial state before changes
      const initialData = { ...existing };

      const filteredItem = { ...item };
      let retries = 0;
      let updated: any = null;

      while (retries < 3) {
        try {
          updated = Object.assign(existing, filteredItem);
          await repo.save(updated);
          break; // success
        } catch (error: any) {
          const msg = error?.message || '';

          const match = msg.match(
            /column "(.*?)" can only be updated to DEFAULT/,
          );
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
          relations: [
            'recordedSpecies',
            'Larval_site',
            'ace1AlleleFrequencies',
            'ace1GenotypeFrequencies',
            'ace1MethodAndSample',
            'anthropo_zoophagic',
            'biology',
            'bionomics',
            'biting_activity',
            'biting_rate',
            'cyp4j5AlleleFrequencies',
            'cyp4j5GenotypeFrequencies',
            'cyp6aapAlleleFrequencies',
            'cyp6aapGenotypeFrequencies',
            'cyp6p4AlleleFrequencies',
            'cyp6p4GenotypeFrequencies',
            'cytochromesP450_cypMethodAndSample',
            'dataset',
            'endo_exophagic',
            'endo_exophily',
            'environment',
            'genotypicRepresentativeness',
            'geography_columns',
            'geometry_columns',
            'gste2_114AlleleFrequencies',
            'gste2_114GenotypeFrequencies',
            'gste2_119AlleleFrequencies',
            'gste2_119GenotypeFrequencies',
            'gsteMethodAndSample',
            'infection',
            'insecticideResistanceBioassays',
            'kdrGenotypeFrequencies',
            'occurrence',
            'rdl296AlleleFrequencies',
            'rdl296GenotypeFrequencies',
            'rdlMethodAndSample',
            'recorded_species',
            'reference',
            'sample',
            'site',
            'species_information',
            'uploaded_dataset',
            'uploaded_dataset_log',
            'user_role',
            'vgsc1570AlleleFrequencies',
            'vgsc1570GenotypeFrequencies',
            'vgsc402AlleleFrequencies',
          ],
        });
        if (!record) throw new NotFoundException('Occurrence not found');
        return record;
      }

      case 'Larval_site':
        return this.larvalSiteRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'dataset':
        return this.datasetRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'insecticideResistanceBioassays':
        return this.insecticideResistanceBioassaysRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'bionomics':
        return this.bionomicsRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'ace1AlleleFrequencies': {
        const records = await this.ace1AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'ace1GenotypeFrequencies': {
        const records = await this.ace1GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'ace1MethodAndSample': {
        const records = await this.ace1MethodAndSampleRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'anthropo_zoophagic': {
        const records = await this.anthropoZoophagicRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'biology': {
        const records = await this.biologyRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'biting_activity': {
        const records = await this.bitingActivityRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'biting_rate': {
        const records = await this.bitingRateRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'cyp4j5AlleleFrequencies': {
        const records = await this.cyp4j5AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cyp4j5GenotypeFrequencies': {
        const records = await this.cyp4j5GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cyp6aapAlleleFrequencies': {
        const records = await this.cyp6aapAlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cyp6aapGenotypeFrequencies': {
        const records = await this.cyp6aapGenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cyp6p4AlleleFrequencies': {
        const records = await this.cyp6p4AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cyp6p4GenotypeFrequencies': {
        const records = await this.cyp6p4GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'cytochromesP450_cypMethodAndSample': {
        const records =
          await this.cytochromesP450CypMethodAndSampleRepository.find({
            where: {
              insecticideResistanceBioassays: {
                occurrence: { id: occurrenceId },
              },
            },
            relations: [
              'insecticideResistanceBioassays',
              'insecticideResistanceBioassays.occurrence',
            ],
          });
        return records;
      }

      case 'endo_exophagic': {
        const records = await this.endoExophagicRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'endo_exophily': {
        const records = await this.endoExophilyRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'environment': {
        const records = await this.environmentRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'genotypicRepresentativeness': {
        const records = await this.genotypicRepresentativenessRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'gste2_114AlleleFrequencies': {
        const records = await this.gste2114AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'gste2_114GenotypeFrequencies': {
        const records = await this.gste2114GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'gste2_119AlleleFrequencies': {
        const records = await this.gste2119AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'gste2_119GenotypeFrequencies': {
        const records = await this.gste2119GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'gsteMethodAndSample': {
        const records = await this.gsteMethodAndSampleRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'infection': {
        const records = await this.infectionRepository.find({
          where: {
            bionomics: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: ['bionomics', 'bionomics.occurrence'],
        });
        return records;
      }

      case 'kdrGenotypeFrequencies': {
        const records = await this.kdrGenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'rdl296AlleleFrequencies': {
        const records = await this.rdl296AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'vgsc1570AlleleFrequencies': {
        const records = await this.vgsc1570AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'vgsc1570GenotypeFrequencies': {
        const records = await this.vgsc1570GenotypeFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'vgsc402AlleleFrequencies': {
        const records = await this.vgsc402AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'rdlMethodAndSample': {
        const records = await this.rdlMethodAndSampleRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: { id: occurrenceId },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
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
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
        });
        return records;
      }

      case 'recordedSpecies':
        return this.speciesRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'reference':
        return this.referenceRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'sample':
        return this.sampleRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'site':
        return this.siteRepository.find({
          where: { occurrence: { id: occurrenceId } },
        });

      case 'vgsc402AlleleFrequencies': {
        const records = await this.vgsc402AlleleFrequenciesRepository.find({
          where: {
            insecticideResistanceBioassays: {
              occurrence: {
                id: occurrenceId,
              },
            },
          },
          relations: [
            'insecticideResistanceBioassays',
            'insecticideResistanceBioassays.occurrence',
          ],
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
