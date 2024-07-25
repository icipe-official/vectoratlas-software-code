import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

@Injectable()
export class InsecticideResistanceService {
  constructor(
    @InjectRepository(InsecticideResistanceBioassays)
    private insecticideResistanceRepository: Repository<InsecticideResistanceBioassays>,
  ) {}
}
