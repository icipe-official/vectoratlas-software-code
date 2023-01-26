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
export class ValueChange {
  @Field()
  value: number
  @Field()
  change: number
}

@ObjectType()
export class Stats {
  @Field()
    pageviews: ValueChange
    @Field()
    uniques: ValueChange
    @Field()
    bounces: ValueChange
    @Field()
    totaltime: ValueChange
}

@ObjectType()
export class Metrics {
  @Field()
  x: string
  @Field()
  y: number
}

export const eventListClassTypeResolver = () => [Event];
export const statsClassTypeResolver = () => Stats;
export const metricsClassTypeResolver = () => [Metrics];

@Resolver()
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query(eventListClassTypeResolver)
  async getAnalyticsEvents(
    @Args('startAt') startAt: number,
    @Args('endAt') endAt: number,
    @Args('unit') unit: string,
    @Args('timezone') timezone: string,
  ) {
    const analytics = this.analyticsService
    await analytics.init();
    const res = analytics.eventAnalytics(startAt, endAt, unit, timezone)
    return res;
  }

  @Query(statsClassTypeResolver)
  async getAnalyticsStats(
    @Args('startAt') startAt: number,
    @Args('endAt') endAt: number,
  ) {
    const analytics = this.analyticsService
    await analytics.init();
    const res = analytics.statsAnalytics(startAt, endAt)
    return res;
  }

  @Query(metricsClassTypeResolver)
  async getMetricsStats(
    @Args('startAt') startAt: number,
    @Args('endAt') endAt: number,
    @Args('type') type: string,
  ) {
    const analytics = this.analyticsService
    await analytics.init();
    const res = analytics.metricsAnalytics(startAt, endAt, type)
    return res;
  }
}

  