import { getRepositoryToken } from '@nestjs/typeorm';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformation } from './entities/speciesInformation.entity';
import { buildTestingModule } from '../../testHelpers';

describe('SpeciesInformation service', () => {
  let service: SpeciesInformationService;
  let speciesInformationRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<SpeciesInformationService>(SpeciesInformationService);
    speciesInformationRepositoryMock = module.get(
      getRepositoryToken(SpeciesInformation),
    );
  });

  it('speciesInformationById finds one by ID from the repository', async () => {
    const expectedSpeciesInformation = new SpeciesInformation();
    speciesInformationRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedSpeciesInformation);

    const result = await service.speciesInformationById('123');
    expect(result).toEqual(expectedSpeciesInformation);
    expect(speciesInformationRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('allSpeciesInformation returns all species information', async () => {
    const expectedSpeciesInformation = [
      new SpeciesInformation(),
      new SpeciesInformation(),
      new SpeciesInformation(),
    ];

    speciesInformationRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedSpeciesInformation);

    const result = await service.allSpeciesInformation();
    expect(result).toEqual(expectedSpeciesInformation);
    expect(speciesInformationRepositoryMock.find).toHaveBeenCalled();
  });
});
