import { getRepositoryToken } from '@nestjs/typeorm';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Occurrence service', () => {
  let service: OccurrenceService;
  let occurrenceRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<OccurrenceService>(OccurrenceService);
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedOccurrence = new Occurrence();
    occurrenceRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedOccurrence);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedOccurrence);
    expect(occurrenceRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedOccurrences = [
      new Occurrence(),
      new Occurrence(),
      new Occurrence(),
    ];
    occurrenceRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedOccurrences);

    const result = await service.findAll();
    expect(result).toEqual(expectedOccurrences);
    expect(occurrenceRepositoryMock.find).toHaveBeenCalled();
  });
});
