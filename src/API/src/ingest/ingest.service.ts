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
import { Species } from 'src/db/shared/entities/species.entity';
import { DeepPartial, Repository } from 'typeorm';
import * as bionomicsMapper from './bionomics.mapper';
import * as occurrenceMapper from './occurrence.mapper';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Bionomics)
    private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
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
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
    @InjectRepository(Occurrence)
    private occurrenceRepository: Repository<Occurrence>,
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
        const anthropoZoophagic =
          bionomicsMapper.mapBionomicsAnthropoZoophagic(bionomics);
        const endoExophagic =
          bionomicsMapper.mapBionomicsEndoExophagic(bionomics);
        const bitingActivity =
          bionomicsMapper.mapBionomicsBitingActivity(bionomics);
        const endoExophily =
          bionomicsMapper.mapBionomicsEndoExophily(bionomics);

        const entity: DeepPartial<Bionomics> = {
          ...bionomicsMapper.mapBionomics(bionomics),
          reference: await this.findOrCreateReference(bionomics),
          site: await this.findOrCreateSite(bionomics),
          species: await this.findOrCreateSpecies(bionomics),
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
      await this.linkOccurrence(bionomicsArray);
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
      const occurrenceArray: DeepPartial<Occurrence>[] = [];
      for (const occurrence of rawArray) {
        const sample = occurrenceMapper.mapOccurrenceSample(occurrence);
        const entity: DeepPartial<Occurrence> = {
          ...occurrenceMapper.mapOccurrence(occurrence),
          reference: await this.findOrCreateReference(occurrence, false),
          site: await this.findOrCreateSite(occurrence, false),
          species: await this.findOrCreateSpecies(occurrence, false),
          sample: await this.sampleRepository.save(sample),
        };
        occurrenceArray.push(entity);
      }

      await this.occurrenceRepository.save(occurrenceArray);
      await this.linkBionomics(occurrenceArray);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async linkOccurrence(entityArray: DeepPartial<Bionomics>[]) {
    for (const bionomics of entityArray) {
      const occurrence = await this.occurrenceRepository.findOne({
        where: {
          site: { id: bionomics.site.id },
          reference: { id: bionomics.reference.id },
          species: { id: bionomics.species.id },
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
          species: { id: occurrence.species.id },
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
    const reference: Reference = await this.referenceRepository.findOne({
      where: {
        author: entity.Author,
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

  async findOrCreateSpecies(
    entity,
    isBionomics = true,
  ): Promise<Partial<Species>> {
    const species: Species = await this.speciesRepository.findOne({
      where: {
        species_1: entity.Species_1,
        species_2: entity.Species_2,
      },
    });
    return (
      species ??
      (await this.speciesRepository.save(
        isBionomics
          ? bionomicsMapper.mapBionomicsSpecies(entity)
          : occurrenceMapper.mapOccurrenceSpecies(entity),
      ))
    );
  }
}