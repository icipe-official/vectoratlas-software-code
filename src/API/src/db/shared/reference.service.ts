import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { Repository } from 'typeorm';

// Only these columns are ever allowed as a dynamic filter target — this
// whitelist exists specifically to prevent filterField (which ultimately
// comes from user input via the frontend dropdown) from being used to
// inject an arbitrary column/expression into the raw SQL string below.
const ALLOWED_FILTER_FIELDS = ['article_title', 'author', 'journal_title'];

@Injectable()
export class ReferenceService {
  constructor(
    @InjectRepository(Reference)
    private referenceRepository: Repository<Reference>,
  ) {}

  findOneById(id: string): Promise<Reference> {
    return this.referenceRepository.findOne({ where: { id: id } });
  }

  findOneByNumId(num_id: number): Promise<Reference> {
    return this.referenceRepository.findOne({ where: { num_id } });
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

  async update(
    num_id: number,
    updates: Partial<Reference>,
  ): Promise<Reference> {
    const existing = await this.findOneByNumId(num_id);
    if (!existing) {
      throw new NotFoundException(`Reference with num_id ${num_id} not found`);
    }
    const merged = this.referenceRepository.merge(existing, updates);
    return this.referenceRepository.save(merged);
  }

  async findReferences(
    take: number,
    skip: number,
    orderBy: string,
    order: 'ASC' | 'DESC',
    startId: number,
    endId: number,
    textFilter: string,
    filterField = 'article_title',
  ): Promise<{ items: Reference[]; total: number }> {
    const nonStringCols = ['num_id', 'year', 'published', 'v_data'];
    const orderByString = nonStringCols.includes(orderBy)
      ? `reference.${orderBy}`
      : `LOWER(reference.${orderBy})`;

    // Guard against an unexpected/invalid filterField value reaching the
    // raw query string below — falls back to the original hardcoded
    // column if the requested one isn't in the allowed list.
    const safeFilterField = ALLOWED_FILTER_FIELDS.includes(filterField)
      ? filterField
      : 'article_title';

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
        `LOWER("reference"."${safeFilterField}") LIKE :textFilter`,
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
