import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

@Injectable()
export class InsecticideResistanceService {
  constructor(
    @InjectRepository(InsecticideResistanceBioassays)
    private irRepository: Repository<InsecticideResistanceBioassays>,
  ) {}

  findOneById(id: string): Promise<InsecticideResistanceBioassays> {
    return this.irRepository.findOne({ where: { id } });
  }

  async findBioassays(
    take: number,
    skip: number,
    filters: {
      insecticideTested?: string[];
      insecticideClass?: string[];
      iracMoa?: string[];
      mortalityMin?: number;
      mortalityMax?: number;
    },
  ): Promise<{ items: InsecticideResistanceBioassays[]; total: number }> {
    // Joins on the raw FK column rather than TypeORM relation metadata:
    // InsecticideResistanceBioassays.occurrence is declared as
    // @OneToMany(() => Occurrence, occurrence => occurrence.sample) — a
    // confirmed pre-existing mismatch (points at the sample relation, not
    // this one). The real, confirmed FK is
    // occurrence."insecticideResistanceBioassaysId" -> insecticideResistanceBioassays(id).
    let query = this.irRepository
      .createQueryBuilder('ir')
      .innerJoin(
        'occurrence',
        'occurrence',
        'occurrence."insecticideResistanceBioassaysId" = ir.id',
      )
      .innerJoin('dataset', 'dataset', 'dataset.id = occurrence."datasetId"')
      .where("dataset.status = 'Approved'");

    if (filters.insecticideTested && filters.insecticideTested.length > 0) {
      query = query.andWhere(
        '"ir"."insecticide_tested" IN (:...insecticideTested)',
        {
          insecticideTested: filters.insecticideTested,
        },
      );
    }
    if (filters.insecticideClass && filters.insecticideClass.length > 0) {
      query = query.andWhere(
        '"ir"."insecticide_class" IN (:...insecticideClass)',
        {
          insecticideClass: filters.insecticideClass,
        },
      );
    }
    if (filters.iracMoa && filters.iracMoa.length > 0) {
      query = query.andWhere('"ir"."irac_moa" IN (:...iracMoa)', {
        iracMoa: filters.iracMoa,
      });
    }
    if (filters.mortalityMin !== undefined) {
      query = query.andWhere(
        'NULLIF("ir"."percent_mortality", \'\')::numeric >= :min',
        {
          min: filters.mortalityMin,
        },
      );
    }
    if (filters.mortalityMax !== undefined) {
      query = query.andWhere(
        'NULLIF("ir"."percent_mortality", \'\')::numeric <= :max',
        {
          max: filters.mortalityMax,
        },
      );
    }

    const [items, total] = await query.take(take).skip(skip).getManyAndCount();
    return { items, total };
  }
}
