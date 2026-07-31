import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async create(country: Country) {
    return await this.countryRepository.save(country);
  }

  async findAll() {
    return await this.countryRepository.find({
      order: {
        modified: 'DESC', 
      },
    });
  }

  async findOne(id: string) {
    return await this.countryRepository.findOne({
      where: { id: id },
      relations: ['sites'],
    });
  }

  async update(id: string, country: Country) {
    const res = await this.findOne(id);
    if (res) {
      country.id = id;
      return await this.countryRepository.save(country);
    }
  }

  async remove(id: string) {
    const res = await this.findOne(id);
    if (res) {
      return await this.countryRepository.remove(res);
    }
    return null;
  }
}
