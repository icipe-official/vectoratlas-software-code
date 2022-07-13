import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeoDataEntity } from './geo_data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeoDataService {
  constructor(
    @InjectRepository(GeoDataEntity)
    private geoDataRepository: Repository<GeoDataEntity>,
  ) {}

  findOneById(id: string): Promise<GeoDataEntity> {
    return this.geoDataRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<GeoDataEntity[]> {
    return this.geoDataRepository.find({ where: { species: 'Anopheles' } });
  }
}
