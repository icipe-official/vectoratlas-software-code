import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as csvtojson from 'csvtojson';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Repository } from 'typeorm';
import * as mapper from './ingest.mapper';

@Injectable()
export class IngestService {

  constructor(@InjectRepository(Bionomics) private bionomicsRepository: Repository<Bionomics>) {}

  async saveBionomicsCsvToDb(csv: string) {
    //console.log(csv);
    const bionomicsArray = await csvtojson({
      ignoreEmpty: true,
      flatKeys: true,
      checkColumn: true
    }).fromString(csv);

    bionomicsArray.map(bionomics => {
      bionomics.reference = mapper.mapBionomicsReference(bionomics);
    })

    try {
      const bionomics = await this.bionomicsRepository.save(bionomicsArray);
      console.log(bionomics);
    } catch (e) {
      console.error(e);
    }
  }
}
