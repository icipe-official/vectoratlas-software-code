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
import { DeepPartial, Not, Repository } from 'typeorm';
import * as bionomicsMapper from './bionomics.mapper';
import * as occurrenceMapper from './occurrence.mapper';
import { triggerAllDataCreationHandler } from './utils/triggerCsvRebuild';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Bionomics) private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Reference) private referenceRepository: Repository<Reference>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(RecordedSpecies) private recordedSpeciesRepository: Repository<RecordedSpecies>,
    @InjectRepository(Biology) private biologyRepository: Repository<Biology>,
    @InjectRepository(Infection) private infectionRepository: Repository<Infection>,
    @InjectRepository(BitingRate) private bitingRateRepository: Repository<BitingRate>,
    @InjectRepository(Environment) private environmentRepository: Repository<Environment>,
    @InjectRepository(AnthropoZoophagic) private anthropoZoophagicRepository: Repository<AnthropoZoophagic>,
    @InjectRepository(EndoExophagic) private endoExophagicRepository: Repository<EndoExophagic>,
    @InjectRepository(BitingActivity) private bitingActivityRepository: Repository<BitingActivity>,
    @InjectRepository(EndoExophily) private endoExophilyRepository: Repository<EndoExophily>,
    @InjectRepository(Sample) private sampleRepository: Repository<Sample>,
    @InjectRepository(Occurrence) private occurrenceRepository: Repository<Occurrence>,
    @InjectRepository(Dataset) private datasetRepository: Repository<Dataset>,
    @Inject(OccurrenceService) private readonly occurrenceService: OccurrenceService,
    @Inject(BionomicsService) private readonly bionomicsService: BionomicsService,
    private logger: Logger,
  ) {}

  async deleteDataByDataset(datasetId: string, isBionomics: boolean) {
    const toDelete = isBionomics
      ? await this.bionomicsRepository.find({ where: { dataset: { id: datasetId } } })
      : await this.occurrenceRepository.find({ where: { dataset: { id: datasetId } } });

    await Promise.all(
      toDelete.map((entity) =>
        isBionomics ? this.deleteBionomics(entity as Bionomics) : this.deleteOccurrence(entity as Occurrence),
      ),
    );
  }

  async deleteBionomics(entity: Bionomics) {
    const bionomics = await this.bionomicsRepository.findOne({
      where: { id: entity.id },
      relations: [
        'biology', 'bitingRate', 'bitingActivity', 'infection',
        'anthropoZoophagic', 'endoExophagic', 'endoExophily', 'environment',
      ],
    });

    if (bionomics) {
      await this.bionomicsRepository.delete({ id: entity.id });
      const cleanup = [
        bionomics.biology && this.biologyRepository.delete({ id: bionomics.biology.id }),
        bionomics.bitingRate && this.bitingRateRepository.delete({ id: bionomics.bitingRate.id }),
        bionomics.bitingActivity && this.bitingActivityRepository.delete({ id: bionomics.bitingActivity.id }),
        bionomics.infection && this.infectionRepository.delete({ id: bionomics.infection.id }),
        bionomics.anthropoZoophagic && this.anthropoZoophagicRepository.delete({ id: bionomics.anthropoZoophagic.id }),
        bionomics.endoExophagic && this.endoExophagicRepository.delete({ id: bionomics.endoExophagic.id }),
        bionomics.endoExophily && this.endoExophilyRepository.delete({ id: bionomics.endoExophily.id }),
        bionomics.environment && this.environmentRepository.delete({ id: bionomics.environment.id }),
      ].filter(Boolean);
      await Promise.all(cleanup);
    }
  }

  async deleteOccurrence(entity: Occurrence) {
    const occurrence = await this.occurrenceRepository.findOne({
      where: { id: entity.id },
      relations: ['sample'],
    });
    if (occurrence) {
      await this.occurrenceRepository.delete({ id: entity.id });
      if (occurrence.sample) {
        await this.sampleRepository.delete({ id: occurrence.sample.id });
      }
    }
  }

  async saveBionomicsCsvToDb(csv: string, userId: string, datasetId?: string, doi?: string) {
    const rawArray = await csvtojson({ ignoreEmpty: true, flatKeys: true, checkColumn: true }).fromString(csv);
    try {
      if (datasetId) await this.deleteDataByDataset(datasetId, true);

      const newDatasetId = datasetId || uuidv4();
      const bionomicsArray: DeepPartial<Bionomics>[] = [];
      const dataset: Partial<Dataset> = { status: 'Uploaded', UpdatedBy: userId, UpdatedAt: new Date(), id: newDatasetId, doi };

      for (const row of rawArray) {
        const entity: DeepPartial<Bionomics> = {
          ...bionomicsMapper.mapBionomics(row),
          reference: await this.findOrCreateReference(row),
          site: await this.findOrCreateSite(row),
          biology: bionomicsMapper.mapBionomicsBiology(row) ? await this.biologyRepository.save(bionomicsMapper.mapBionomicsBiology(row)) : null,
          infection: bionomicsMapper.mapBionomicsInfection(row) ? await this.infectionRepository.save(bionomicsMapper.mapBionomicsInfection(row)) : null,
          bitingRate: bionomicsMapper.mapBionomicsBitingRate(row) ? await this.bitingRateRepository.save(bionomicsMapper.mapBionomicsBitingRate(row)) : null,
          environment: bionomicsMapper.mapEnvironment(row) ? await this.environmentRepository.save(bionomicsMapper.mapEnvironment(row)) : null,
          anthropoZoophagic: bionomicsMapper.mapBionomicsAnthropoZoophagic(row) ? await this.anthropoZoophagicRepository.save(bionomicsMapper.mapBionomicsAnthropoZoophagic(row)) : null,
          endoExophagic: bionomicsMapper.mapBionomicsEndoExophagic(row) ? await this.endoExophagicRepository.save(bionomicsMapper.mapBionomicsEndoExophagic(row)) : null,
          bitingActivity: bionomicsMapper.mapBionomicsBitingActivity(row) ? await this.bitingActivityRepository.save(bionomicsMapper.mapBionomicsBitingActivity(row)) : null,
          endoExophily: bionomicsMapper.mapBionomicsEndoExophily(row) ? await this.endoExophilyRepository.save(bionomicsMapper.mapBionomicsEndoExophily(row)) : null,
          dataset,
        };
        bionomicsArray.push(entity);
      }

      await this.bionomicsRepository.save(bionomicsArray);
      await this.linkOccurrence(bionomicsArray);
      return newDatasetId;
    } catch (e) {
      this.logger.error(`Bionomics Ingest Failed: ${e.message}`);
      throw e;
    }
  }

  async saveOccurrenceCsvToDb(csv: string, userId: string, datasetId?: string, doi?: string) {
    try {
      const rawArray = await csvtojson({ ignoreEmpty: true, flatKeys: true, checkColumn: true }).fromString(csv);
      if (datasetId) await this.deleteDataByDataset(datasetId, false);

      const occurrenceArray: DeepPartial<Occurrence>[] = [];
      const newDatasetId = datasetId || uuidv4();
      const dataset: Partial<Dataset> = { status: 'Uploaded', UpdatedBy: userId, UpdatedAt: new Date(), id: newDatasetId, doi };

      const samples = await this.sampleRepository.save(rawArray.map(row => occurrenceMapper.mapOccurrenceSample(row)));

      for (let i = 0; i < rawArray.length; i++) {
        const row = rawArray[i];
        const entity: DeepPartial<Occurrence> = {
          ...occurrenceMapper.mapOccurrence(row),
          reference: await this.findOrCreateReference(row, false),
          site: await this.findOrCreateSite(row, false),
          recordedSpecies: occurrenceMapper.mapOccurrenceRecordedSpecies(row),
          sample: samples[i],
          download_count: 0,
          dataset,
        };
        occurrenceArray.push(entity);
      }

      await this.occurrenceRepository.save(occurrenceArray);
      await this.linkBionomics(occurrenceArray);
      triggerAllDataCreationHandler();
      return newDatasetId;
    } catch (e) {
      this.logger.error(`Occurrence Ingest Failed: ${e.message}`);
      throw e;
    }
  }

  async linkOccurrence(entityArray: DeepPartial<Bionomics>[]) {
    await Promise.all(
      entityArray.map(async (bionomics) => {
        const occurrence = await this.occurrenceRepository.createQueryBuilder('occurrence')
          .where('occurrence.month_start = :ms', { ms: bionomics.month_start })
          .andWhere('occurrence.year_start = :ys', { ys: bionomics.year_start })
          .andWhere('occurrence.month_end = :me', { me: bionomics.month_end })
          .andWhere('occurrence.year_end = :ye', { ye: bionomics.year_end })
          .andWhere('occurrence.siteId = :sid', { sid: bionomics.site.id })
          .andWhere('occurrence.referenceId = :rid', { rid: bionomics.reference.id })
          .getOne();

        if (occurrence) {
          await this.occurrenceRepository.update(occurrence.id, { bionomics: bionomics as Bionomics });
        }
      }),
    );
  }

  async linkBionomics(entityArray: DeepPartial<Occurrence>[]) {
    await Promise.all(
      entityArray.map(async (occurrence) => {
        const bionomics = await this.bionomicsRepository.createQueryBuilder('bionomics')
          .leftJoinAndSelect('bionomics.recordedSpecies', 'recordedSpecies')
          .where('bionomics.month_start = :ms', { ms: occurrence.month_start })
          .andWhere('bionomics.year_start = :ys', { ys: occurrence.year_start })
          .andWhere('bionomics.month_end = :me', { me: occurrence.month_end })
          .andWhere('bionomics.year_end = :ye', { ye: occurrence.year_end })
          .andWhere('bionomics.siteId = :sid', { sid: occurrence.site.id })
          .andWhere('bionomics.referenceId = :rid', { rid: occurrence.reference.id })
          .andWhere('recordedSpecies.species = :speciesName', { speciesName: occurrence.recordedSpecies.species })
          .getOne();

        if (bionomics) {
          await this.occurrenceRepository.update(occurrence.id, { bionomics });
        }
      }),
    );
  }

  async findOrCreateReference(row: any, isBionomics = true): Promise<Partial<Reference>> {
    let reference = await this.referenceRepository.findOne({
      where: { author: row.author, year: row['publication year'] },
    });
    if (!reference) {
      const [{ nextval: num_id }] = await this.referenceRepository.query("select nextval('reference_id_seq')");
      const mapped = isBionomics ? bionomicsMapper.mapBionomicsReference(row) : occurrenceMapper.mapOccurrenceReference(row);
      reference = await this.referenceRepository.save({ ...mapped, num_id });
    }
    return reference;
  }

  async findOrCreateSite(row: any, isBionomics = true): Promise<Partial<Site>> {
    let site = await this.siteRepository.findOne({
      where: { latitude: row.latitude_1, longitude: row.longitude_1 },
    });
    if (!site) {
      const mapped = isBionomics ? bionomicsMapper.mapBionomicsSite(row) : occurrenceMapper.mapOccurrenceSite(row);
      site = await this.siteRepository.save(mapped);
    }
    return site;
  }

  async validUser(datasetId: string, userId: string): Promise<boolean> {
    const count = await this.datasetRepository.count({ where: { id: datasetId, UpdatedBy: userId } });
    return count > 0;
  }

  async validDataset(datasetId: string): Promise<boolean> {
    const count = await this.datasetRepository.count({ where: { id: datasetId } });
    return count > 0;
  }

  async doiExists(doi: string, datasetId?: string): Promise<boolean> {
    const count = await this.datasetRepository.count({
      where: datasetId ? { doi, id: Not(datasetId) } : { doi }
    });
    return count > 0;
  }
}