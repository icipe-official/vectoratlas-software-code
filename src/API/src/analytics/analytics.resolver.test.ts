import { AnalyticsResolver } from './analytics.resolver';

describe('AnalyticsResolver', () => {
  let resolver: AnalyticsResolver;
  let mockAnalyticsService;

  beforeEach(async () => {
    mockAnalyticsService = {
        init: jest.fn(),
        eventAnalytics: jest.fn(),
        recordsAnalytics: jest.fn().mockResolvedValue({recordsTotal: 1, recordsDownload:2}),
        metricsAnalytics: jest.fn(),
        statsAnalytics: jest.fn().mockResolvedValue({uniques:{value:1} , pageviews:{value:2}}),
    };

    resolver = new AnalyticsResolver(mockAnalyticsService);
  });

  it('getHomePageAnalytics call on methods of service', () => {
    resolver.getHomepageAnalytics(1,2,'test','mock');
    expect(mockAnalyticsService.init).toHaveBeenCalled();
    expect(mockAnalyticsService.eventAnalytics).toHaveBeenCalledWith(1,2,'test','mock');
    expect(mockAnalyticsService.recordsAnalytics).toHaveBeenCalled();
    expect(mockAnalyticsService.metricsAnalytics).toHaveBeenCalledWith(1,2,'country');
    expect(mockAnalyticsService.statsAnalytics).toHaveBeenCalledWith(1,2);
  });
});
