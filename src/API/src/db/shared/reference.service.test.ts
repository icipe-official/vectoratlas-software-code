import { getRepositoryToken } from '@nestjs/typeorm';
import { ReferenceService } from './reference.service';
import { Reference } from './entities/reference.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Reference service', () => {
  let service: ReferenceService;
  let referenceRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get(ReferenceService);
    referenceRepositoryMock = module.get(getRepositoryToken(Reference));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedReference = new Reference();
    referenceRepositoryMock.findOne = jest
      .fn()
      .mockResolvedValue(expectedReference);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedReference);
    expect(referenceRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedReference = [
      new Reference(),
      new Reference(),
      new Reference(),
    ];
    referenceRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedReference);

    const result = await service.findAll();
    expect(result).toEqual(expectedReference);
    expect(referenceRepositoryMock.find).toHaveBeenCalled();
  });
});
