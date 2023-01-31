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
  lastValueFrom: jest.fn((s) => s).mockResolvedValue([{ x: 'test', y: 1 }]),
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
    service = module.get<AnalyticsService>(AnalyticsService);
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
    mockQueryBuilder = occurrenceRepositoryMock.createQueryBuilder();
    mockQueryBuilder.getRawMany = jest.fn().mockResolvedValue([
      { occurrence_id: 'test 1', downloads: 1 },
      { occurrence_id: 'test 2', downloads: 2 },
    ]);
    process.env.ANALYTICS_ADMIN_PASSWORD = 'test password';
    process.env.ANALYTICS_API_URL = 'http://localhost:3003/mock';

    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUmamiToken should return a token', async () => {
    service.init();
    expect(await getUmamiToken(httpClient)).toEqual([{ x: 'test', y: 1 }]);
  });

  it('should send off a post request, from within getUmami token', async () => {
    service.init();
    expect(httpClient.post).toHaveBeenCalledWith(
      'http://localhost:3003/mock/auth/login',
      { password: 'umami', username: 'admin' },
    );
    expect(rxjs.lastValueFrom).toHaveBeenCalled();
  });

  it('should send off a get request, from eventAnalytics', async () => {
    service.eventAnalytics(1, 2, 'test', 'mock');
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/fa6b40f4-9ba3-4f80-936c-2696c34f62db/events?start_at=1&end_at=2&unit=test&tz=mock',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should send off a get request, from statsAnalytics', async () => {
    service.statsAnalytics(1, 2);
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/fa6b40f4-9ba3-4f80-936c-2696c34f62db/stats?start_at=1&end_at=2',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should send off a get request, from metricsAnalytics', async () => {
    service.metricsAnalytics(1, 2, 'test');
    expect(httpClient.get).toHaveBeenCalledWith(
      'http://localhost:3003/mock/websites/fa6b40f4-9ba3-4f80-936c-2696c34f62db/metrics?start_at=1&end_at=2&type=test',
      { headers: { Authorization: 'Bearer undefined' } },
    );
  });

  it('should query occurrence repo twice in order to obtain count data', async () => {
    await service.recordsAnalytics();
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(2);
  });
});
