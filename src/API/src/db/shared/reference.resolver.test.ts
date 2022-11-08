import { ReferenceResolver } from './reference.resolver';

describe('Reference resolver', () => {
  let resolver: ReferenceResolver;
  let referenceService;

  beforeEach(() => {
    referenceService = {
      findOneById: jest.fn(),
      findAll: jest.fn(),
    };

    resolver = new ReferenceResolver(referenceService);
  });

  it('referenceData delegates finding one by id to reference service', () => {
    resolver.referenceData('123');

    expect(referenceService.findOneById).toHaveBeenCalledWith('123');
  });

  it('allReferenceData delegates finding all to reference service', () => {
    resolver.allReferenceData();

    expect(referenceService.findAll).toHaveBeenCalled();
  });
});
