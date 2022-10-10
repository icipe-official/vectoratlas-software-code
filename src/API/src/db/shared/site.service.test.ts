import { getRepositoryToken } from '@nestjs/typeorm';
import { SiteService } from './site.service';
import { Site } from './entities/site.entity';
import { buildTestingModule } from '../../testHelpers';

describe('Sample service', () => {
  let service;
  let siteRepositoryMock;

  beforeEach(async () => {
    const module = await buildTestingModule();

    service = module.get<SiteService>(SiteService);
    siteRepositoryMock = module.get(getRepositoryToken(Site));
  });

  it('findOneById finds one by ID from the repository', async () => {
    const expectedSite = new Site();
    siteRepositoryMock.findOne = jest.fn().mockResolvedValue(expectedSite);

    const result = await service.findOneById('123');
    expect(result).toEqual(expectedSite);
    expect(siteRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('findAll returns all samples', async () => {
    const expectedSites = [new Site(), new Site(), new Site()];
    siteRepositoryMock.find = jest.fn().mockResolvedValue(expectedSites);

    const result = await service.findAll();
    expect(result).toEqual(expectedSites);
    expect(siteRepositoryMock.find).toHaveBeenCalled();
  });
});
