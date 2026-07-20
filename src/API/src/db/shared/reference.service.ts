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

    // Create base query builder for reference table
    let query = this.referenceRepository.createQueryBuilder('reference');

    // Join through occurrence to dataset using entity relationships
    // This ensures we only return references that are linked to occurrences in approved datasets
    query = query
      .innerJoin(Occurrence, 'occ', 'occ.referenceId = reference.id')
      .innerJoin(Dataset, 'ds', 'ds.id = occ.datasetId')
      .andWhere('ds.status = :status', { status: 'Approved' })
      .distinct(true);

    // Apply optional filters
    if (startId && !isNaN(startId)) {
      query = query.andWhere('reference.num_id >= :startId', {
        startId,
      });
    }
    if (endId && !isNaN(endId)) {
      query = query.andWhere('reference.num_id <= :endId', {
        endId,
      });
    }
    if (textFilter) {
      query = query.andWhere(
        'LOWER(reference.article_title) LIKE :textFilter',
        {
          textFilter: `%${textFilter.toLocaleLowerCase()}%`,
        },
      );
    }

    // Apply ordering
    // For string columns, we add a computed LOWER column to SELECT and order by its alias
    // This avoids TypeORM's expression parser issues with LOWER() in ORDER BY
    if (nonStringCols.includes(orderBy)) {
      query = query.addOrderBy(`"reference"."${orderBy}"`, order);
    } else {
      const lowerAlias = `lower_${orderBy}`;
      query = query.addSelect(`LOWER("reference"."${orderBy}")`, lowerAlias);
      query = query.addOrderBy(lowerAlias, order);
    }

    // Execute query with pagination
    const [items, total] = await query.skip(skip).take(take).getManyAndCount();

    return { items, total };
  }
}
