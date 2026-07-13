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
        id: 'ASC',
      },
    });
  }

  async allSpeciesInformationPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: SpeciesInformation[]; total: number; hasMore: boolean }> {
    const [items, total] = await this.speciesInformationRepository.findAndCount({
      order: { id: 'ASC' },
      skip: page * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      hasMore: (page + 1) * pageSize < total,
    };
  }

  async upsertSpeciesInformation(info: SpeciesInformation) {
    return await this.speciesInformationRepository.save(info);
  }

  async deleteSpeciesInformation(id: string): Promise<boolean> {
    const result = await this.speciesInformationRepository.delete(id);
    return result.affected > 0;
  }
}