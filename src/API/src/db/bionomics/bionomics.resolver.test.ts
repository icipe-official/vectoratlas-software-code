import { BionomicsResolver } from './bionomics.resolver';

describe('Bionomics resolver', () => {
  let resolver: BionomicsResolver;
  let bionomicsService;

  beforeEach(() => {
    bionomicsService = {
      findOneById: jest.fn(),
      findAll: jest.fn(),
    };

    resolver = new BionomicsResolver(bionomicsService);
  });

  it('geoData delegates finding one by id to bionomics service', () => {
    resolver.geoData('123');

    expect(bionomicsService.findOneById).toHaveBeenCalledWith('123');
  });

  it('allGeoData delegates finding all to bionomics service', () => {
    resolver.allGeoData();

    expect(bionomicsService.findAll).toHaveBeenCalled();
  });
});
