import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bionomics } from './entities/bionomics.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class BionomicsService {
  constructor(
    @InjectRepository(Bionomics)
    private bionomicsRepository: Repository<Bionomics>,
  ) {}

  findOneById(id: string): Promise<Bionomics> {
    return this.bionomicsRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Bionomics[]> {
    return this.bionomicsRepository.find();
  }

  async findBionomics(
    take: number,
    skip: number,
    filters: {
      country?: string[];
      season?: string[];
      control?: string[];
      insecticideControl?: boolean[];
      itnUse?: boolean[];
      startTimestamp?: number;
      endTimestamp?: number;
    },
  ): Promise<{ items: Bionomics[]; total: number }> {
    let query = this.bionomicsRepository
      .createQueryBuilder('bionomics')
      .innerJoin('bionomics.dataset', 'dataset')
      .innerJoinAndSelect('bionomics.site', 'site')
      .where("dataset.status = 'Approved'");

    if (filters.country && filters.country.length > 0) {
      const countryValues = filters.country.map((v) => v.toUpperCase());
      query = query.andWhere('UPPER("site"."country") IN (:...country)', {
        country: countryValues,
      });
    }
    if (filters.season && filters.season.length > 0) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('"bionomics"."season_given" IN (:...season)', {
            season: filters.season,
          }).orWhere('"bionomics"."season_calc" IN (:...season)', {
            season: filters.season,
          });
        }),
      );
    }
    if (filters.control && filters.control.length > 0) {
      const controlValues = filters.control.map((v) => v.toUpperCase());
      query = query.andWhere('UPPER("bionomics"."control") IN (:...control)', {
        control: controlValues,
      });
    }
    if (filters.insecticideControl && filters.insecticideControl.length > 0) {
      query = query.andWhere(
        '"bionomics"."insecticide_control" IN (:...insecticideControl)',
        { insecticideControl: filters.insecticideControl },
      );
    }
    if (filters.itnUse && filters.itnUse.length > 0) {
      query = query.andWhere('"bionomics"."itn_use" IN (:...itnUse)', {
        itnUse: filters.itnUse,
      });
    }
    if (
      filters.startTimestamp !== undefined &&
      filters.endTimestamp !== undefined
    ) {
      query = query.andWhere(
        '"bionomics"."timestamp_end" >= :start AND "bionomics"."timestamp_start" < :end',
        {
          start: new Date(filters.startTimestamp),
          end: new Date(filters.endTimestamp),
        },
      );
    }

    const [items, total] = await query.take(take).skip(skip).getManyAndCount();
    return { items, total };
  }
}
