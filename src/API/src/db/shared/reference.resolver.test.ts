import { Reference } from './entities/reference.entity';
import { ReferenceResolver } from './reference.resolver';

describe('Reference resolver', () => {
  let resolver: ReferenceResolver;
  let referenceService;

  beforeEach(() => {
    referenceService = {
      findOneById: jest.fn(),
      findAll: jest.fn(),
      findReferences: jest.fn().mockResolvedValue({
        items: [new Reference(), new Reference()],
        total: 2,
      })
    };

    resolver = new ReferenceResolver(referenceService);
  });

  it('referenceData delegates finding one by id to reference service', () => {
    resolver.referenceData('123');

    expect(referenceService.findOneById).toHaveBeenCalledWith('123');
  });

  it('allReferenceData delegates finding all to reference service', () => {
    resolver.allReferenceData({take: 0, skip: 100});

    expect(referenceService.findReferences).toHaveBeenCalledWith(0, 100);
  });
});
