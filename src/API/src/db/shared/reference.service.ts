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

  save(reference: Partial<Reference>): Promise<Reference> {
    return this.referenceRepository.save(reference);
  }
}
