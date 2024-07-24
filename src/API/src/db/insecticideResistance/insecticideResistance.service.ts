import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { insecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

@Injectable()
export class InsecticideResistanceService {
  constructor(
    @InjectRepository(insecticideResistanceBioassays)
    private insecticideResistanceRepository: Repository<insecticideResistanceBioassays>,
  ) {}

}
