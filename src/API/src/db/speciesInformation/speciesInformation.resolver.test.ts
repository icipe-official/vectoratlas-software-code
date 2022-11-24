import { buildTestingModule } from '../../testHelpers';
import { SpeciesInformationResolver } from './speciesInformation.resolver';
import { SpeciesInformationService } from './speciesInformation.service';

describe('SpeciesInformationResolver', () => {
  let resolver: SpeciesInformationResolver;
  let mockSpeciesInformationService;

  beforeEach(async () => {
    const module = await buildTestingModule();

    resolver = module.get<SpeciesInformationResolver>(SpeciesInformationResolver);

    mockSpeciesInformationService = module.get<SpeciesInformationService>(SpeciesInformationService);
    mockSpeciesInformationService.speciesInformationById = jest.fn();
    mockSpeciesInformationService.allSpeciesInformation = jest.fn();
  });

  it('speciesInformationById function calls on speciesInformationById from species information service', () => {
    const id = '123';
    resolver.speciesInformationById(id);
    expect(mockSpeciesInformationService.speciesInformationById).toHaveBeenCalledWith(id);
  });

  it('allSpeciesInformation function calls on allSpeciesInformation from species information service', () => {
    resolver.allSpeciesInformation();
    expect(mockSpeciesInformationService.allSpeciesInformation).toHaveBeenCalled();
  });
});
