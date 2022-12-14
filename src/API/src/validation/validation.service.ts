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
import { Validator } from '../validation/types/base.validator';

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
    @Inject(OccurrenceService)
    private readonly occurrenceService: OccurrenceService,
    @Inject(BionomicsService)
    private readonly bionomicsService: BionomicsService,
    private logger: Logger,
  ) {}

  async saveBionomicsCsvToDb(csv: string) {
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      const bionomicsArray: DeepPartial<Bionomics>[] = [];
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

        bionomicsArray.push(entity);
      }

      await this.bionomicsRepository.save(bionomicsArray);
      await this.linkOccurrence(bionomicsArray);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async saveOccurrenceCsvToDb(csv: string) {
    const errorLog = [];
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      for (const [i, occurrence] of rawArray.entries()) {
        const occurrenceValidator = new Validator('occurrence', occurrence, i);
        occurrenceValidator.isValid();
        errorLog.push(occurrenceValidator.errors);
      }
      return errorLog;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
