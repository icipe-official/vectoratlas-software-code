import { buildTestingModule } from '../../testHelpers';
import { RecordedSpecies } from './entities/recorded_species.entity';
import { RecordedSpeciesResolver } from './recordedSpecies.resolver';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';

describe('RecordedSpeciesResolver', () => {
  let resolver: RecordedSpeciesResolver;
  let mockSpeciesService;

  beforeEach(async () => {
    const module = await buildTestingModule();

    resolver = module.get<RecordedSpeciesResolver>(RecordedSpeciesResolver);

    mockSpeciesService = module.get<SpeciesService>(SpeciesService);
    mockSpeciesService.findOneById = jest.fn();
  });

  it('getSpecies delegates to the species service', async () => {
    const parent = new RecordedSpecies();
    parent.species = {
      id: '123',
    } as Species;

    await resolver.getSpecies(parent);

    expect(mockSpeciesService.findOneById).toHaveBeenCalledWith('123');
  });
});
