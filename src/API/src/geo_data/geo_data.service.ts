import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoData } from './geo_data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeoDataService {
  constructor(
    @InjectRepository(GeoData)
    private geoDataRepository: Repository<GeoData>,
  ) {}

  findOneById(id: string): Promise<GeoData> {
    return this.geoDataRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<GeoData[]> {
    return this.geoDataRepository.find({ where: { species: 'Anopheles' } });
  }
}
