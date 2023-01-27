import { Query } from '@nestjs/graphql';
import { Args, Field, ObjectType, Resolver } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';

@ObjectType()
export class Event {
  @Field()
  x: string
  @Field()
  t: string
  @Field()
  y: number
}

@ObjectType()
export class HomepageStats {
  @Field()
  pageViews: number
  @Field({nullable:true})
  countries: number
  @Field()
  uniqueViews: number
  @Field()
  events: number
}

interface HomepageStatsType {
  pageViews: number,
  countries: number,
  uniqueViews: number,
  events: number,
  recordsDownloaded: number,
}

export const homepageClassTypeResolver = () => HomepageStats;

@Resolver()
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(homepageClassTypeResolver)
  async getHomepageAnalytics(
    @Args('startAt') startAt: number,
    @Args('endAt') endAt: number,
    @Args('unit') unit: string,
    @Args('timezone') timezone: string,
  ) {
    let homepageStats: HomepageStatsType = {
      pageViews: 0,
      countries:0,
      uniqueViews: 0,
      events: 0,
      recordsDownloaded: 0
    }
    const analytics = this.analyticsService
    await analytics.init();
    homepageStats.events = await analytics.eventAnalytics(startAt, endAt, unit, timezone)
    homepageStats.recordsDownloaded = await analytics.recordsAnalytics()
    homepageStats.countries = (await analytics.metricsAnalytics(startAt, endAt, 'country'))
    const statsAnalytics = await analytics.statsAnalytics(startAt, endAt)
    homepageStats.uniqueViews = statsAnalytics.uniques.value
    homepageStats.pageViews = statsAnalytics.pageviews.value
    return homepageStats;
  }
}
  