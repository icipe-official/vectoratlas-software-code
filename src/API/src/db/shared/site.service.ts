import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  findOneById(id: string): Promise<Site> {
    return this.siteRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Site[]> {
    return this.siteRepository.find();
  }
}
