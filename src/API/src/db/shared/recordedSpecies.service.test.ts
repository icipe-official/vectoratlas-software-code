import { getRepositoryToken } from '@nestjs/typeorm';
import { buildTestingModule } from '../../testHelpers';
import { RecordedSpecies } from './entities/recorded_species.entity';
import { RecordedSpeciesService } from './recordedSpecies.service';

describe('Recorded species service', () => {
  let service: RecordedSpeciesService;
  let recordedSpeciesRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<RecordedSpeciesService>(RecordedSpeciesService);
    recordedSpeciesRepositoryMock = module.get(
      getRepositoryToken(RecordedSpecies),
    );
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedRecordedSpecies = new RecordedSpecies();
    recordedSpeciesRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedRecordedSpecies);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedRecordedSpecies);
    expect(recordedSpeciesRepositoryMock.findOne).toHaveBeenCalledWith({
      relations: ['species'],
      where: { id: '123' },
    });
  });

  it('findAll returns all recorded species', async () => {
    const expectedRecordedSpecies = [
      new RecordedSpecies(),
      new RecordedSpecies(),
      new RecordedSpecies(),
    ];
    recordedSpeciesRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedRecordedSpecies);

    const result = await service.findAll();
    expect(result).toEqual(expectedRecordedSpecies);
    expect(recordedSpeciesRepositoryMock.find).toHaveBeenCalled();
  });
});
