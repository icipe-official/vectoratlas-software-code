import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sample } from './entities/sample.entity';

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) {}

  findOneById(id: string): Promise<Sample> {
    return this.sampleRepository.findOne({ where: { id: id } });
  }

  findAll(): Promise<Sample[]> {
    return this.sampleRepository.find();
  }
}
