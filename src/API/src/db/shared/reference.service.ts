import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,
  ) {}

  findOneById(id: string): Promise<Reference> {
    return this.referenceRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Reference[]> {
    return this.referenceRepository.find();
  }

  async save(reference: Partial<Reference>): Promise<Reference> {
    reference.num_id = (
      await this.referenceRepository.query("select nextval('reference_id_seq')")
    )[0].nextval;
    return this.referenceRepository.save(reference);
  }

  async findReferences(
    take: number,
    skip: number,
    orderBy: string,
    order: 'ASC' | 'DESC',
    startId: number,
    endId: number,
    textFilter: string,
  ): Promise<{ items: Reference[]; total: number }> {
    const numCols = ['num_id', 'year'];
    const orderByString = numCols.includes(orderBy)
      ? `reference.${orderBy}`
      : `LOWER(reference.${orderBy})`;
    let query = this.referenceRepository.createQueryBuilder('reference');

    if (startId && !isNaN(startId)) {
      query = query.andWhere('"reference"."num_id" >= :startId', {
        startId,
      });
    }
    if (endId && !isNaN(endId)) {
      query = query.andWhere('"reference"."num_id" <= :endId', {
        endId,
      });
    }
    if (textFilter) {
      query = query.andWhere(
        'LOWER("reference"."article_title") LIKE :textFilter',
        {
          textFilter: `%${textFilter.toLocaleLowerCase()}%`,
        },
      );
    }

    const [items, total] = await query
      .orderBy(orderByString, order)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { items, total };
  }
}
