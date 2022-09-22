import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvtojson from 'csvtojson';
import { AnthropoZoophagic } from 'src/db/bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { BitingActivity } from 'src/db/bionomics/entities/biting_activity.entity';
import { BitingRate } from 'src/db/bionomics/entities/biting_rate.entity';
import { EndoExophagic } from 'src/db/bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from 'src/db/bionomics/entities/endo_exophily.entity';
import { Infection } from 'src/db/bionomics/entities/infection.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { RecordedSpecies } from 'src/db/shared/entities/recorded_species.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import * as bionomicsMapper from './bionomics.mapper';
import * as occurrenceMapper from './occurrence.mapper';
import { Species } from 'src/db/shared/entities/species.entity';

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
    @InjectRepository(Species) private speciesRepository: Repository<Species>,
    @InjectRepository(Biology) private biologyRepository: Repository<Biology>,
    @InjectRepository(Infection)
    private infectionRepository: Repository<Infection>,
    @InjectRepository(BitingRate)
    private bitingRateRepository: Repository<BitingRate>,
    @InjectRepository(AnthropoZoophagic)
    private anthropoZoophagicRepository: Repository<AnthropoZoophagic>,
    @InjectRepository(EndoExophagic)
    private endoExophagicRepository: Repository<EndoExophagic>,
    @InjectRepository(BitingActivity)
    private bitingActivityRepository: Repository<BitingActivity>,
    @InjectRepository(EndoExophily)
    private endoExophilyRepository: Repository<EndoExophily>,
    @InjectRepository(Sample) private sampleRepository: Repository<Sample>,
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Sample>,
  ) {}

  async saveBionomicsCsvToDb(csv: string) {
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      const bionomicsArray = [];
      for (const bionomics of rawArray) {
        const biology = bionomicsMapper.mapBionomicsBiology(bionomics);
        const infection = bionomicsMapper.mapBionomicsInfection(bionomics);
        const bitingRate = bionomicsMapper.mapBionomicsBitingRate(bionomics);
        const anthropoZoophagic =
          bionomicsMapper.mapBionomicsAnthropoZoophagic(bionomics);
        const endoExophagic =
          bionomicsMapper.mapBionomicsEndoExophagic(bionomics);
        const bitingActivity =
          bionomicsMapper.mapBionomicsBitingActivity(bionomics);
        const endoExophily =
          bionomicsMapper.mapBionomicsEndoExophily(bionomics);
        const species = bionomicsMapper.mapBionomicsSpecies(bionomics);
        await this.linkSpecies(species, bionomics);
        const entity: DeepPartial<Bionomics> = {
          ...bionomicsMapper.mapBionomics(bionomics),
          reference: await this.findOrCreateReference(bionomics),
          site: await this.findOrCreateSite(bionomics),
          species: await this.recordedSpeciesRepository.save(species),
          biology: biology ? await this.biologyRepository.save(biology) : null,
          infection: infection
            ? await this.infectionRepository.save(infection)
            : null,
          bitingRate: bitingRate
            ? await this.bitingRateRepository.save(bitingRate)
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async saveOccurrenceCsvToDb(csv: string) {
    const rawArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true,
    }).fromString(csv);
    try {
      const occurrenceArray = [];
      for (const occurrence of rawArray) {
        const sample = occurrenceMapper.mapOccurrenceSample(occurrence);
        const species = occurrenceMapper.mapOccurrenceSpecies(occurrence);
        await this.linkSpecies(species, occurrence, false);
        const entity: DeepPartial<Occurrence> = {
          ...occurrenceMapper.mapOccurrence(occurrence),
          reference: await this.findOrCreateReference(occurrence, false),
          site: await this.findOrCreateSite(occurrence, false),
          species: await this.recordedSpeciesRepository.save(species),
          sample: await this.sampleRepository.save(sample),
        };
        occurrenceArray.push(entity);
      }

      await this.occurrenceRepository.save(occurrenceArray);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findOrCreateReference(
    entity,
    isBionomics = true,
  ): Promise<Partial<Reference>> {
    const reference: Reference = await this.referenceRepository.findOne({
      where: {
        author: entity.Author,
        article_title: entity['Article title'],
        journal_title: entity['Journal title'],
        year: entity.Year,
      },
    });
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

  async linkSpecies(
    species: Partial<RecordedSpecies>,
    entity: any,
    isBionomics = true,
  ) {
    const speciesString = isBionomics ? entity.Species_1 : entity['Species 1'];
    const speciesEntity = await this.speciesRepository.findOne({
      where: {
        species: ILike(speciesString),
      },
    });

    if (!speciesEntity) {
      throw new Error('No species data found for species ' + speciesString);
    }
    species.species = speciesEntity;
  }
}
