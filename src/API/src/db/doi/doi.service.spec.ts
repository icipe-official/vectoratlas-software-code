import { Test, TestingModule } from '@nestjs/testing';
import { DoiService } from './doi.service';
import { DOI } from './entities/doi.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApprovalStatus } from 'src/commonTypes';
import { getCurrentUser } from './util';
import { HttpService } from '@nestjs/axios';
import * as rxjs from 'rxjs';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { buildTestingModule } from 'src/testHelpers';

jest.mock('@nestjs/axios', () => ({
  HttpService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('rxjs', () => ({
  lastValueFrom: jest
    .fn((s) => s)
    .mockResolvedValue([
      { name: 'vector-atlas-test', x: 'test', y: 1, websiteUuid: 'test-uuid' },
    ]),
  map: jest.fn(),
}));

describe('DoiService', () => {
  let service: DoiService;
  let doiRepositoryMock;
  let httpClient: MockType<HttpService>;

  beforeEach(async () => {
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };

    //const module = await buildTestingModule();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoiService,
        {
          provide: HttpService,
          useValue: httpClient,
        },
        {
          provide: getRepositoryToken(DOI),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<DoiService>(DoiService);
    doiRepositoryMock = module.get(getRepositoryToken(DOI));
    //httpClient = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getDOI gets one DOI by ID from the repository', async () => {
    const expectedDataset = new DOI();
    doiRepositoryMock.findOne = jest.fn().mockResolvedValue(expectedDataset);

    const result = await service.getDOI('123');
    expect(result).toEqual(expectedDataset);
    expect(doiRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('upsert saves new DOI to the database', async () => {
    const doi = new DOI();
    doi.id = 'test';
    await service.upsert(doi);

    expect(doiRepositoryMock.save).toHaveBeenCalledWith(doi);
  });

  it('getDOIS gets all DOIs from the database', async () => {
    await service.getDOIs();

    expect(doiRepositoryMock.find).toHaveBeenCalledWith({
      relations: ['site', 'sample', 'recordedSpecies'],
    });
  });

  it('approveDOI approves a DOI', async () => {
    const doi = new DOI();
    doi.id = '1234';
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    await service.upsert(doi);
    await service.approveDOI(doi);

    expect(doiRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        approval_status: ApprovalStatus.APPROVED,
        status_updated_by: getCurrentUser(),
        status_updated_on: now,
      }),
    );
  });

  it('rejectDOI rejects a DOI', async () => {
    const doi = new DOI();
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    await service.rejectDOI(doi);

    expect(doiRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        approval_status: ApprovalStatus.REJECTED,
        status_updated_by: getCurrentUser(),
        status_updated_on: now,
      }),
    );
  });
});
