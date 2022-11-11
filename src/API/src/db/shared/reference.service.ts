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

  async findReferences(
    take: number,
    skip: number,
  ): Promise<{ items: Reference[]; total: number }> {
    const [items, total] = await this.referenceRepository
      .createQueryBuilder('reference')
      .orderBy('reference.num_id')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return { items, total };
  }
}
