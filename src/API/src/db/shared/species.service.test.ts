import { getRepositoryToken } from '@nestjs/typeorm';
import { buildTestingModule } from '../../testHelpers';
import { Species } from './entities/species.entity';
import { SpeciesService } from './species.service';

describe('Sample service', () => {
  let service;
  let speciesRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<SpeciesService>(SpeciesService);
    speciesRepositoryMock = module.get(getRepositoryToken(Species));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedSpecies = new Species();
    speciesRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedSpecies);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedSpecies);
    expect(speciesRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedSpeciess = [new Species(), new Species(), new Species()];
    speciesRepositoryMock.find = jest.fn().mockResolvedValue(expectedSpeciess);

    const result = await service.findAll();
    expect(result).toEqual(expectedSpeciess);
    expect(speciesRepositoryMock.find).toHaveBeenCalled();
  });
});
