import {
  CreateSpeciesInformationInput,
  SpeciesInformationResolver,
} from './speciesInformation.resolver';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123'),
}));

describe('SpeciesInformationResolver', () => {
  let resolver: SpeciesInformationResolver;
  let mockSpeciesInformationService;

  beforeEach(async () => {
    mockSpeciesInformationService = {
      speciesInformationById: jest.fn(),
      allSpeciesInformation: jest.fn(),
      upsertSpeciesInformation: jest.fn(),
    };

    resolver = new SpeciesInformationResolver(mockSpeciesInformationService);
  });

  it('speciesInformationById function calls on speciesInformationById from species information service', () => {
    const id = '123';
    resolver.speciesInformationById(id);
    expect(
      mockSpeciesInformationService.speciesInformationById,
    ).toHaveBeenCalledWith(id);
  });

  it('allSpeciesInformation function calls on allSpeciesInformation from species information service', () => {
    resolver.allSpeciesInformation();
    expect(
      mockSpeciesInformationService.allSpeciesInformation,
    ).toHaveBeenCalled();
  });

  describe('createEditSpeciesInformation', () => {
    it('generates an ID for new items', () => {
      const input = new CreateSpeciesInformationInput();
      input.name = 'test name';

      resolver.createEditSpeciesInformation(input);

      expect(
        mockSpeciesInformationService.upsertSpeciesInformation,
      ).toHaveBeenCalledWith({
        id: 'id123',
        name: 'test name',
        distributionMapUrl: '',
      });
    });
  });
});
