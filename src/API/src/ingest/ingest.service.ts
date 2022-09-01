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
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { Species } from 'src/db/shared/entities/species.entity';
import { Repository } from 'typeorm';
import * as mapper from './ingest.mapper';
import { isEmpty } from 'src/utils';

@Injectable()
export class IngestService {

  constructor(
    @InjectRepository(Bionomics) private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Reference) private referenceRepository: Repository<Reference>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Species) private speciesRepository: Repository<Species>,
    @InjectRepository(Biology) private biologyRepository: Repository<Biology>,
    @InjectRepository(Infection) private infectionRepository: Repository<Infection>,
    @InjectRepository(BitingRate) private bitingRateRepository: Repository<BitingRate>,
    @InjectRepository(AnthropoZoophagic) private anthropoZoophagicRepository: Repository<AnthropoZoophagic>,
    @InjectRepository(EndoExophagic) private endoExophagicRepository: Repository<EndoExophagic>,
    @InjectRepository(BitingActivity) private bitingActivityRepository: Repository<BitingActivity>,
    @InjectRepository(EndoExophily) private endoExophilyRepository: Repository<EndoExophily>,
    ) {}

  async saveBionomicsCsvToDb(csv: string) {
    var bionomicsArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true
    }).fromString(csv);

    try {
      bionomicsArray = await Promise.all(bionomicsArray.map(async bionomics => {
        const biology = mapper.mapBionomicsBiology(bionomics)
        const infection = mapper.mapBionomicsEndoExophily(bionomics)
        const bitingRate = mapper.mapBionomicsBitingRate(bionomics)
        const anthropoZoophagic = mapper.mapBionomicsAnthropoZoophagic(bionomics)
        const endoExophagic = mapper.mapBionomicsEndoExophagic(bionomics)
        const bitingActivity = mapper.mapBionomicsBitingActivity(bionomics)
        const endoExophily = mapper.mapBionomicsEndoExophily(bionomics)
        console.log(endoExophily)
        return {
          ...mapper.mapBionomics(bionomics),
          reference: await this.findOrCreateReference(bionomics),
          site: await this.findOrCreateSite(bionomics),
          species: await this.findOrCreateSpecies(bionomics),
          biology: biology ? await this.biologyRepository.save(biology) : null,
          infection: infection ? await this.infectionRepository.save(infection) : null,
          bitingRate: bitingRate ? await this.bitingRateRepository.save(bitingRate) : null,
          anthropoZoophagic: anthropoZoophagic ? await this.anthropoZoophagicRepository.save(anthropoZoophagic) : null,
          endoExophagic: endoExophagic ? await this.endoExophagicRepository.save(endoExophagic) : null,
          bitingActivity: bitingActivity ? await this.bitingActivityRepository.save(bitingActivity) : null,
          endoExophily: endoExophily ? await this.endoExophilyRepository.save(endoExophily) : null,
        }
      }));

      const bionomics = await this.bionomicsRepository.save(bionomicsArray);
      console.log(bionomics);
    } catch (e) {
      console.error(e);
    }
  }

  async findOrCreateReference(bionomics) : Promise<Partial<Reference>> {
    const reference: Reference = await this.referenceRepository.findOne({
      where: {
        author: bionomics.Author,
        article_title: bionomics['Article title'],
        journal_title: bionomics['Journal title'],
        year: bionomics.Year,
      }
    })
    return reference ?? mapper.mapBionomicsReference(bionomics);
  }

  async findOrCreateSite(bionomics) : Promise<Partial<Site>> {
    const site: Site = await this.siteRepository.findOne({
      where: {
        area_type: bionomics['Area type'],
        latitude: bionomics.Latitude,
        longitude: bionomics.Longitude,
      }
    })
    return site ?? mapper.mapBionomicsSite(bionomics);
  }

  async findOrCreateSpecies(bionomics) : Promise<Partial<Species>> {
    const species: Species = await this.speciesRepository.findOne({
      where: {
        species_1: bionomics.Species_1,
        species_2: bionomics.Species_2,
      }
    })
    return species ?? mapper.mapBionomicsSpecies(bionomics);
  }
}
