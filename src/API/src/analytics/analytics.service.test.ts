import { AnalyticsService, getUmamiToken } from './analytics.service';
import { MockType } from 'src/mocks';
import { Logger } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { buildTestingModule } from 'src/testHelpers';
import * as rxjs from 'rxjs';

jest.mock('rxjs', () => ({
    lastValueFrom: jest.fn(s=>s).mockResolvedValue('test token'),
    map: jest.fn()
  }));

jest.mock('@nestjs/axios', () => ({
    HttpService: {
        get: jest.fn(),
        post: jest.fn()
    }
}));

describe('AnalyticsService', () => {
  const OLD_ENV = process.env;
  let service: AnalyticsService;
  let occurrenceRepositoryMock;
  let logger: MockType<Logger>;
  let httpClient: HttpService;

  beforeEach(async () => {
    const module = await buildTestingModule();
    httpClient = module.get<HttpService>(HttpService);
    service = module.get<AnalyticsService>(AnalyticsService);
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
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
        service.init()
        expect(await getUmamiToken(httpClient)).toEqual('test token')
    });

    it('should send off a post request, from within getUmami token', async () => {
        service.init()
        expect(httpClient.post).toHaveBeenCalledWith('http://localhost:3003/mock/auth/login', {"password": "umami", "username": "admin"});
        expect(rxjs.lastValueFrom).toHaveBeenCalled();
        })

    it('should send off a post request, from within getUmami token', async () => {
        service.eventAnalytics(1,2,'test','mock')
        expect(httpClient.get).toHaveBeenCalledWith('');
        })
})
