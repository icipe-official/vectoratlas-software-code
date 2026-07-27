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

  // Used by the EDIT page. Returns every field, including speciesImage,
  // because the edit page needs the original to display + download.
  async speciesInformationById(id: string): Promise<SpeciesInformation> {
    return await this.speciesInformationRepository.findOne({
      where: { id: id },
    });
  }

  // Used by the LIST page. Deliberately does NOT select speciesImage —
  // that's the large original JPEG, and pulling it for every row in the
  // list would make the list slow to load for no benefit, since the
  // list only ever displays previewImage.
  async allSpeciesInformation(): Promise<SpeciesInformation[]> {
    return await this.speciesInformationRepository.find({
      select: [
        'id',
        'name',
        'shortDescription',
        'description',
        'previewImage',
        'distributionMapUrl',
        'citations',
        'link',
        // speciesImage intentionally left out
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  // Used ONLY by the download endpoint below. When someone on the list
  // page clicks "Download," we don't have speciesImage in memory yet —
  // this does a fast, narrow lookup for just that one field.
  async getSpeciesImageForDownload(
    id: string,
  ): Promise<Pick<SpeciesInformation, 'id' | 'name' | 'speciesImage'>> {
    return await this.speciesInformationRepository.findOne({
      where: { id },
      select: ['id', 'name', 'speciesImage'],
    });
  }

  async upsertSpeciesInformation(info: SpeciesInformation) {
    return await this.speciesInformationRepository.save(info);
  }

  async deleteSpeciesInformation(id: string): Promise<boolean> {
    const result = await this.speciesInformationRepository.delete(id);
    return result.affected > 0;
  }
}
