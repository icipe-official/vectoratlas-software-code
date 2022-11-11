import { getRepositoryToken } from '@nestjs/typeorm';
import { ReferenceService } from './reference.service';
import { Reference } from './entities/reference.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Reference service', () => {
  let service: ReferenceService;
  let referenceRepositoryMock;
  let mockQueryBuilder;

  const expectedReferences = [
    new Reference(),
    new Reference(),
    new Reference(),
  ];

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get(ReferenceService);
    referenceRepositoryMock = module.get(getRepositoryToken(Reference));
    mockQueryBuilder = referenceRepositoryMock.createQueryBuilder();
    mockQueryBuilder.getManyAndCount = jest
      .fn()
      .mockReturnValue([expectedReferences, 1000]);
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
    referenceRepositoryMock.find = jest
      .fn()
      .mockResolvedValue(expectedReferences);

    const result = await service.findAll();
    expect(result).toEqual(expectedReferences);
    expect(referenceRepositoryMock.find).toHaveBeenCalled();
  });

  it('save saves reference with num_id', async () => {
    const ref: Partial<Reference> = { article_title: 'title123' };
    referenceRepositoryMock.query = jest
      .fn()
      .mockResolvedValue([{ nextval: 24 }]);
    referenceRepositoryMock.save = jest.fn();

    await service.save(ref);

    expect(referenceRepositoryMock.save).toHaveBeenCalledWith({
      ...ref,
      num_id: 24,
    });
  });

  it('findReferences returns page and count', async () => {
    const result = await service.findReferences(3, 10);
    expect(result.items).toEqual(expectedReferences);
    expect(result.total).toEqual(1000);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('reference.num_id');
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(3);
  });
});
