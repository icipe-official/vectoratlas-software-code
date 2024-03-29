/* eslint-disable max-len*/
import { AnalyticsService, getUmamiToken } from './analytics.service';
import { HttpService } from '@nestjs/axios';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { buildTestingModule } from 'src/testHelpers';
import * as rxjs from 'rxjs';

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

describe('AnalyticsService', () => {
  const OLD_ENV = process.env;
  let service: AnalyticsService;
  let httpClient: HttpService;
  let occurrenceRepositoryMock;
  let mockQueryBuilder;

  beforeEach(async () => {
    const module = await buildTestingModule();
    httpClient = module.get<HttpService>(HttpService);
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
    mockQueryBuilder = occurrenceRepositoryMock.createQueryBuilder();
    mockQueryBuilder.getRawMany = jest.fn().mockResolvedValue([
      { occurrence_id: 'test 1', downloads: 1 },
      { occurrence_id: 'test 2', downloads: 2 },
    ]);
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      ANALYTICS_ADMIN_PASSWORD: 'test password',
      ANALYTICS_API_URL: 'http://localhost:3003/mock',
    };
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUmamiToken should return a token', async () => {
    service.init();
    expect(await getUmamiToken(httpClient)).toEqual([
      { name: 'vector-atlas-test', x: 'test', y: 1, websiteUuid: 'test-uuid' },
    ]);
  });

  it('should send off a post request, from within getUmami token', async () => {
    service.init();
    expect(httpClient.post).toHaveBeenCalledWith(
      'http://localhost:3003/mock/auth/login',
      { password: 'test password', username: 'admin' },
    );
    expect(rxjs.lastValueFrom).toHaveBeenCalled();
  });

  it('should send off a get request, from eventAnalytics', async () => {
    service.eventAnalytics(1, 2, 'test', 'mock');
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/undefined/events?start_at=1&end_at=2&unit=test&tz=mock',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should send off a get request, from statsAnalytics', async () => {
    service.statsAnalytics(1, 2);
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/undefined/stats?start_at=1&end_at=2',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should send off a get request, from metricsAnalytics', async () => {
    service.metricsAnalytics(1, 2, 'test');
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/undefined/metrics?start_at=1&end_at=2&type=test',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should query occurrence repo once in order to obtain count data', async () => {
    await service.recordsAnalytics();
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(1);
  });
});
