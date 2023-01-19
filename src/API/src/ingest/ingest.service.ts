import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvtojson from 'csvtojson';
import { AnthropoZoophagic } from 'src/db/bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { BionomicsService } from 'src/db/bionomics/bionomics.service';
import { BitingActivity } from 'src/db/bionomics/entities/biting_activity.entity';
import { BitingRate } from 'src/db/bionomics/entities/biting_rate.entity';
import { EndoExophagic } from 'src/db/bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from 'src/db/bionomics/entities/endo_exophily.entity';
import { Infection } from 'src/db/bionomics/entities/infection.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { RecordedSpecies } from 'src/db/shared/entities/recorded_species.entity';
import { Environment } from 'src/db/bionomics/entities/environment.entity';
import { DeepPartial, Repository } from 'typeorm';
import * as bionomicsMapper from './bionomics.mapper';
import * as occurrenceMapper from './occurrence.mapper';
import { triggerAllDataCreationHandler } from './utils/triggerCsvRebuild';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Bionomics)
    private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(RecordedSpecies)
    private recordedSpeciesRepository: Repository<RecordedSpecies>,
    @InjectRepository(Biology) private biologyRepository: Repository<Biology>,
    @InjectRepository(Infection)
    private infectionRepository: Repository<Infection>,
    @InjectRepository(BitingRate)
    private bitingRateRepository: Repository<BitingRate>,
    @InjectRepository(Environment)
    private environmentRepository: Repository<Environment>,
    @InjectRepository(AnthropoZoophagic)
    private anthropoZoophagicRepository: Repository<AnthropoZoophagic>,
    @InjectRepository(EndoExophagic)
    private endoExophagicRepository: Repository<EndoExophagic>,
    @InjectRepository(BitingActivity)
    private bitingActivityRepository: Repository<BitingActivity>,
    @InjectRepository(EndoExophily)
    private endoExophilyRepository: Repository<EndoExophily>,
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    @Inject(OccurrenceService)
    private readonly occurrenceService: OccurrenceService,
    @Inject(BionomicsService)
    private readonly bionomicsService: BionomicsService,
    private logger: Logger,
  ) {}

  async deleteDataByDataset(datasetId: string, isBionomics: boolean) {
    const toDelete = isBionomics
      ? await this.bionomicsRepository
          .createQueryBuilder('bionomics')
          .where('bionomics.datasetId = :datasetId', { datasetId })
          .getMany()
      : await this.occurrenceRepository
          .createQueryBuilder('occurrence')
          .where('occurrence.datasetId = :datasetId', { datasetId })
          .getMany();

    toDelete.forEach(async (entity) => {
      isBionomics
        ? await this.deleteBionomics(entity)
        : await this.deleteOccurrence(entity);
    });
  }

  async deleteBionomics(entity: Bionomics) {
    const bionomics = await this.bionomicsRepository.findOne({
      where: { id: entity.id },
      relations: [
        'biology',
        'bitingRate',
        'bitingActivity',
        'infection',
        'anthropoZoophagic',
        'endoExophagic',
        'endoExophily',
        'environment',
      ],
    });
    await this.bionomicsRepository.delete({ id: entity.id });
    bionomics.biology &&
      (await this.biologyRepository.delete({ id: bionomics.biology.id }));
    bionomics.bitingRate &&
      (await this.bitingRateRepository.delete({ id: bionomics.bitingRate.id }));
    bionomics.bitingActivity &&
      (await this.bitingActivityRepository.delete({
        id: bionomics.bitingActivity.id,
      }));
    bionomics.infection &&
      (await this.infectionRepository.delete({ id: bionomics.infection.id }));
    bionomics.anthropoZoophagic &&
      (await this.anthropoZoophagicRepository.delete({
        id: bionomics.anthropoZoophagic.id,
      }));
    bionomics.endoExophagic &&
      (await this.endoExophagicRepository.delete({
        id: bionomics.endoExophagic.id,
      }));
    bionomics.endoExophily &&
      (await this.endoExophilyRepository.delete({
        id: bionomics.endoExophily.id,
      }));
    bionomics.environment &&
      (await this.environmentRepository.delete({
        id: bionomics.environment.id,
      }));
  }

  async deleteOccurrence(entity: Occurrence) {
    const occurrence = await this.occurrenceRepository.findOne({
      where: { id: entity.id },
      relations: ['sample'],
    });
    await this.occurrenceRepository.delete({ id: entity.id });
    occurrence.sample &&
      (await this.sampleRepository.delete({ id: occurrence.sample.id }));
  }

  async saveBionomicsCsvToDb(csv: string, userId: string, datasetId?: string) {
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      if (datasetId) {
        await this.deleteDataByDataset(datasetId, true);
      }

      const bionomicsArray: DeepPartial<Bionomics>[] = [];
      const dataset: Partial<Dataset> = {
        status: 'Uploaded',
        UpdatedBy: userId,
        UpdatedAt: new Date(),
        id: datasetId || uuidv4(),
      };
      for (const bionomics of rawArray) {
        const biology = bionomicsMapper.mapBionomicsBiology(bionomics);
        const infection = bionomicsMapper.mapBionomicsInfection(bionomics);
        const bitingRate = bionomicsMapper.mapBionomicsBitingRate(bionomics);
        const environment = bionomicsMapper.mapEnvironment(bionomics);
        const anthropoZoophagic =
          bionomicsMapper.mapBionomicsAnthropoZoophagic(bionomics);
        const endoExophagic =
          bionomicsMapper.mapBionomicsEndoExophagic(bionomics);
        const bitingActivity =
          bionomicsMapper.mapBionomicsBitingActivity(bionomics);
        const endoExophily =
          bionomicsMapper.mapBionomicsEndoExophily(bionomics);
        const species = bionomicsMapper.mapBionomicsRecordedSpecies(bionomics);
        const entity: DeepPartial<Bionomics> = {
          ...bionomicsMapper.mapBionomics(bionomics),
          reference: await this.findOrCreateReference(bionomics),
          site: await this.findOrCreateSite(bionomics),
          recordedSpecies: await this.recordedSpeciesRepository.save(species),
          biology: biology ? await this.biologyRepository.save(biology) : null,
          infection: infection
            ? await this.infectionRepository.save(infection)
            : null,
          bitingRate: bitingRate
            ? await this.bitingRateRepository.save(bitingRate)
            : null,
          environment: environment
            ? await this.environmentRepository.save(environment)
            : null,
          anthropoZoophagic: anthropoZoophagic
            ? await this.anthropoZoophagicRepository.save(anthropoZoophagic)
            : null,
          endoExophagic: endoExophagic
            ? await this.endoExophagicRepository.save(endoExophagic)
            : null,
          bitingActivity: bitingActivity
            ? await this.bitingActivityRepository.save(bitingActivity)
            : null,
          endoExophily: endoExophily
            ? await this.endoExophilyRepository.save(endoExophily)
            : null,
        };

        entity.dataset = dataset;
        bionomicsArray.push(entity);
      }

      await this.bionomicsRepository.save(bionomicsArray);
      await this.linkOccurrence(bionomicsArray);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async saveOccurrenceCsvToDb(csv: string, userId: string, datasetId?: string) {
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      if (datasetId) {
        await this.deleteDataByDataset(datasetId, false);
      }

      const occurrenceArray: DeepPartial<Occurrence>[] = [];
      const dataset: Partial<Dataset> = {
        status: 'Uploaded',
        UpdatedBy: userId,
        UpdatedAt: new Date(),
        id: datasetId || uuidv4(),
      };
      for (const occurrence of rawArray) {
        const sample = occurrenceMapper.mapOccurrenceSample(occurrence);
        const recordedSpecies =
          occurrenceMapper.mapOccurrenceRecordedSpecies(occurrence);
        const entity: DeepPartial<Occurrence> = {
          ...occurrenceMapper.mapOccurrence(occurrence),
          reference: await this.findOrCreateReference(occurrence, false),
          site: await this.findOrCreateSite(occurrence, false),
          recordedSpecies: await this.recordedSpeciesRepository.save(
            recordedSpecies,
          ),
          sample: await this.sampleRepository.save(sample),
        };

        entity.dataset = dataset;
        occurrenceArray.push(entity);
      }

      await this.occurrenceRepository.save(occurrenceArray);
      await this.linkBionomics(occurrenceArray);
      triggerAllDataCreationHandler();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async linkOccurrence(entityArray: DeepPartial<Bionomics>[]) {
    for (const bionomics of entityArray) {
      const occurrence = await this.occurrenceRepository.findOne({
        where: {
          site: { id: bionomics.site.id },
          reference: { id: bionomics.reference.id },
          recordedSpecies: {
            species: bionomics.recordedSpecies.species,
          },
          month_start: bionomics.month_start,
          month_end: bionomics.month_end,
          year_start: bionomics.year_start,
          year_end: bionomics.year_end,
        },
      });

      if (occurrence)
        await this.occurrenceRepository.update(occurrence.id, {
          bionomics: bionomics,
        });
    }
  }

  async linkBionomics(entityArray: DeepPartial<Occurrence>[]) {
    for (const occurrence of entityArray) {
      const bionomics = await this.bionomicsRepository.findOne({
        where: {
          site: { id: occurrence.site.id },
          reference: { id: occurrence.reference.id },
          recordedSpecies: {
            species: occurrence.recordedSpecies.species,
          },
          month_start: occurrence.month_start,
          month_end: occurrence.month_end,
          year_start: occurrence.year_start,
          year_end: occurrence.year_end,
        },
      });

      if (bionomics)
        await this.occurrenceRepository.update(occurrence.id, {
          bionomics: bionomics,
        });
    }
  }

  async findOrCreateReference(
    entity,
    isBionomics = true,
  ): Promise<Partial<Reference>> {
    let reference: Reference = await this.referenceRepository.findOne({
      where: {
        author: entity.Author,
        year: entity.Year,
      },
    });
    if (!reference) {
      const num_id = (
        await this.referenceRepository.query(
          "select nextval('reference_id_seq')",
        )
      )[0].nextval;
      reference = await this.referenceRepository.save(
        isBionomics
          ? { ...bionomicsMapper.mapBionomicsReference(entity), num_id }
          : { ...occurrenceMapper.mapOccurrenceReference(entity), num_id },
      );
    }
    return (
      reference ??
      (await this.referenceRepository.save(
        isBionomics
          ? bionomicsMapper.mapBionomicsReference(entity)
          : occurrenceMapper.mapOccurrenceReference(entity),
      ))
    );
  }

  async findOrCreateSite(entity, isBionomics = true): Promise<Partial<Site>> {
    const site: Site = await this.siteRepository.findOne({
      where: {
        latitude: entity.Latitude,
        longitude: entity.Longitude,
      },
    });
    return (
      site ??
      (await this.siteRepository.save(
        isBionomics
          ? bionomicsMapper.mapBionomicsSite(entity)
          : occurrenceMapper.mapOccurrenceSite(entity),
      ))
    );
  }

  async validUser(datasetId, userId): Promise<boolean> {
    return (
      (
        await this.datasetRepository.findAndCount({
          where: {
            id: datasetId,
            UpdatedBy: userId,
          },
        })
      )[1] > 0
    );
  }

  async validDataset(datasetId): Promise<boolean> {
    return (
      (
        await this.datasetRepository.findAndCount({
          where: {
            id: datasetId,
          },
        })
      )[1] > 0
    );
  }
}
