import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpeciesInformation } from './entities/speciesInformation.entity';

@Injectable()
export class SpeciesInformationService {
  constructor(
    @InjectRepository(SpeciesInformation)
    private speciesInformationRepository: Repository<SpeciesInformation>,
  ) {}

  async speciesInformationById(id: string): Promise<SpeciesInformation> {
    return await this.speciesInformationRepository.findOne({
      where: { id: id },
    });
  }

  async allSpeciesInformation(): Promise<SpeciesInformation[]> {
    return await this.speciesInformationRepository.find();
  }

  async upsertSpeciesInformation(info: SpeciesInformation) {
    return await this.speciesInformationRepository.save(info);
  }
}
