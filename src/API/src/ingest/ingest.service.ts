import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvtojson from 'csvtojson';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { Species } from 'src/db/shared/entities/species.entity';
import { Repository } from 'typeorm';
import * as mapper from './ingest.mapper';

@Injectable()
export class IngestService {

  constructor(
    @InjectRepository(Bionomics) private bionomicsRepository: Repository<Bionomics>,
    @InjectRepository(Reference) private referenceRepository: Repository<Reference>,
    @InjectRepository(Site) private siteRepository: Repository<Site>,
    @InjectRepository(Species) private speciesRepository: Repository<Species>,
    @InjectRepository(Biology) private biologyRepository: Repository<Biology>,
    ) {}

  async saveBionomicsCsvToDb(csv: string) {
    var bionomicsArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true
    }).fromString(csv);

    bionomicsArray = await Promise.all(bionomicsArray.map(async bionomics => ({
      ...mapper.mapBionomics(bionomics),
      reference: await this.findOrCreateReference(bionomics),
      site: await this.findOrCreateSite(bionomics),
      species: await this.findOrCreateSpecies(bionomics),
      biology: await this.biologyRepository.save(mapper.mapBionomicsBiology(bionomics)),
    })));

    try {
      const bionomics = await this.bionomicsRepository.create(bionomicsArray);
      await this.bionomicsRepository.save(bionomics);
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
