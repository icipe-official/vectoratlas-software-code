import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reference } from './entities/reference.entity';
import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { Dataset } from './entities/dataset.entity';
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
    const nonStringCols = ['num_id', 'year', 'published', 'v_data'];

    // Build filter conditions that will be applied to both queries
    const filterParams: Record<string, any> = { status: 'Approved' };

    if (startId && !isNaN(startId)) {
      filterParams.startId = startId;
    }
    if (endId && !isNaN(endId)) {
      filterParams.endId = endId;
    }
    if (textFilter) {
      filterParams.textFilter = `%${textFilter.toLocaleLowerCase()}%`;
    }

    // ============================================
    // QUERY 1: Get paginated items
    // ============================================
    let itemsQuery = this.referenceRepository
      .createQueryBuilder('reference')
      .innerJoin(Occurrence, 'occ', 'occ.referenceId = reference.id')
      .innerJoin(Dataset, 'ds', 'ds.id = occ.datasetId')
      .andWhere('ds.status = :status', filterParams)
      .distinct(true);

    // Apply filters to items query
    if (startId && !isNaN(startId)) {
      itemsQuery = itemsQuery.andWhere(
        'reference.num_id >= :startId',
        filterParams,
      );
    }
    if (endId && !isNaN(endId)) {
      itemsQuery = itemsQuery.andWhere(
        'reference.num_id <= :endId',
        filterParams,
      );
    }
    if (textFilter) {
      itemsQuery = itemsQuery.andWhere(
        'LOWER(reference.article_title) LIKE :textFilter',
        filterParams,
      );
    }

    // Apply ordering
    if (nonStringCols.includes(orderBy)) {
      itemsQuery = itemsQuery.addOrderBy(`"reference"."${orderBy}"`, order);
    } else {
      const lowerAlias = `lower_${orderBy}`;
      itemsQuery = itemsQuery.addSelect(
        `LOWER("reference"."${orderBy}")`,
        lowerAlias,
      );
      itemsQuery = itemsQuery.addOrderBy(lowerAlias, order);
    }

    const items = await itemsQuery.skip(skip).take(take).getMany();

    // ============================================
    // QUERY 2: Get DISTINCT count
    // ============================================
    let countQuery = this.referenceRepository
      .createQueryBuilder('reference')
      .select('COUNT(DISTINCT reference.id)', 'count')
      .innerJoin(Occurrence, 'occ2', 'occ2.referenceId = reference.id')
      .innerJoin(Dataset, 'ds2', 'ds2.id = occ2.datasetId')
      .andWhere('ds2.status = :status', { status: 'Approved' });

    // Apply same filters to count query
    if (startId && !isNaN(startId)) {
      countQuery = countQuery.andWhere('reference.num_id >= :startId', {
        startId,
      });
    }
    if (endId && !isNaN(endId)) {
      countQuery = countQuery.andWhere('reference.num_id <= :endId', { endId });
    }
    if (textFilter) {
      countQuery = countQuery.andWhere(
        'LOWER(reference.article_title) LIKE :textFilter',
        {
          textFilter: `%${textFilter.toLocaleLowerCase()}%`,
        },
      );
    }

    const countResult = await countQuery.getRawOne();
    const total = parseInt(countResult.count, 10) || 0;

    return { items, total };
  }
}
