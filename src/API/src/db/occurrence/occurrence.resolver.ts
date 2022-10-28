import {
  Args,
  ArgsType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Int,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { Max, Min } from '@nestjs/class-validator';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { Site } from '../shared/entities/site.entity';
import { SiteService } from '../shared/site.service';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { RecordedSpeciesService } from '../shared/recordedSpecies.service';
import { Sample } from './entities/sample.entity';
import { SampleService } from './sample.service';
import PaginatedResponse from '../../pagination/pagination';

export const occurrencePaginatedListClassTypeResolver = () =>
  PaginatedOccurrenceData;
export const occurrenceClassTypeResolver = () => Occurrence;
export const occurrenceListClassTypeResolver = () => [Occurrence];
export const siteClassTypeResolver = () => Site;
export const sampleClassTypeResolver = () => Sample;
export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;
export const integerTypeResolver = () => Int;

@ObjectType()
class PaginatedOccurrenceData extends PaginatedResponse(Occurrence) {}

@ArgsType()
export class GetOccurrenceDataArgs {
  @Field(integerTypeResolver, { nullable: true, defaultValue: 1 })
  @Min(1)
  @Max(100)
  take: number;

  @Field(integerTypeResolver, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;
}

@Resolver(occurrenceClassTypeResolver)
export class OccurrenceResolver {
  constructor(
    private occurrenceService: OccurrenceService,
    private siteService: SiteService,
    private sampleService: SampleService,
    private recordedSpeciesService: RecordedSpeciesService,
  ) {}

  @Query(occurrenceClassTypeResolver)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.occurrenceService.findOneById(id);
  }

  @Query(occurrenceListClassTypeResolver)
  async allGeoData() {
    return this.occurrenceService.findAll();
  }

  @Query(occurrencePaginatedListClassTypeResolver)
  async OccurrenceData(@Args() { take, skip }: GetOccurrenceDataArgs) {
    const { items, total } = await this.occurrenceService.findOccurrences(
      take,
      skip,
    );
    return Object.assign(new PaginatedOccurrenceData(), {
      items,
      total,
      hasMore: total > take + skip,
    });
  }

  @ResolveField('site', siteClassTypeResolver)
  async getSite(@Parent() parent: Occurrence): Promise<Site> {
    return await this.siteService.findOneById(parent.site.id);
  }

  @ResolveField('sample', sampleClassTypeResolver)
  async getSample(@Parent() parent: Occurrence): Promise<Sample> {
    return await this.sampleService.findOneById(parent.sample.id);
  }

  @ResolveField('recorded_species', recordedSpeciesClassTypeResolver)
  async getRecordedSpecies(
    @Parent() parent: Occurrence,
  ): Promise<RecordedSpecies> {
    return await this.recordedSpeciesService.findOneById(
      parent.recordedSpecies.id,
    );
  }
}
