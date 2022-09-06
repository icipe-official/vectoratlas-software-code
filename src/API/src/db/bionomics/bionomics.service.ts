import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bionomics } from './entities/bionomics.entity';
import { Repository } from 'typeorm';

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
}
