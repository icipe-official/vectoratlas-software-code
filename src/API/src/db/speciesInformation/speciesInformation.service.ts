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
    return await this.speciesInformationRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async upsertSpeciesInformation(info: SpeciesInformation) {
    return await this.speciesInformationRepository.save(info);
  }

  async deleteSpeciesInformation(id: string): Promise<boolean> {
    // Perform the deletion logic, for example using TypeORM or another method
    const result = await this.speciesInformationRepository.delete(id);
    return result.affected > 0; // Returns true if deletion was successful
}
}
