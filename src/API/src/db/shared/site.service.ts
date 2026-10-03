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

  async findSites(
    take: number,
    skip: number,
    filters: {
      country?: string[];
      adminLevel1?: string[];
      adminLevel2?: string[];
      areaType?: string[];
    },
  ): Promise<{ items: Site[]; total: number }> {
    let query = this.siteRepository.createQueryBuilder('site');

    if (filters.country && filters.country.length > 0) {
      const countryValues = filters.country.map((v) => v.toUpperCase());
      query = query.andWhere('UPPER("site"."country") IN (:...country)', {
        country: countryValues,
      });
    }
    if (filters.adminLevel1 && filters.adminLevel1.length > 0) {
      query = query.andWhere('"site"."admin_level_1" IN (:...adminLevel1)', {
        adminLevel1: filters.adminLevel1,
      });
    }
    if (filters.adminLevel2 && filters.adminLevel2.length > 0) {
      query = query.andWhere('"site"."admin_level_2" IN (:...adminLevel2)', {
        adminLevel2: filters.adminLevel2,
      });
    }
    if (filters.areaType && filters.areaType.length > 0) {
      query = query.andWhere('"site"."area_type" IN (:...areaType)', {
        areaType: filters.areaType,
      });
    }

    const [items, total] = await query.take(take).skip(skip).getManyAndCount();
    return { items, total };
  }
}
