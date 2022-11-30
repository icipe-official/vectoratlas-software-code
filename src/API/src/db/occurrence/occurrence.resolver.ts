import {
  Args,
  ArgsType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Field,
  ObjectType,
  InputType,
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
import { BionomicsService } from '../bionomics/bionomics.service';
import { Bionomics } from '../bionomics/entities/bionomics.entity';
import { Reference } from '../shared/entities/reference.entity';
import { ReferenceService } from '../shared/reference.service';
import { flattenOccurrenceRepoObject } from '../../export/utils/allDataCsvCreation';

export const occurrencePaginatedListClassTypeResolver = () =>
  PaginatedOccurrenceData;
export const occurrencePaginatedCsvListClassTypeResolver = () =>
  PaginatedStringData;
export const occurrenceClassTypeResolver = () => Occurrence;
export const occurrenceListClassTypeResolver = () => [Occurrence];
export const siteClassTypeResolver = () => Site;
export const sampleClassTypeResolver = () => Sample;
export const bionomicsClassTypeResolver = () => Bionomics;
export const referenceClassTypeResolver = () => Reference;
export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;
export const integerTypeResolver = () => Number;
export const floatTypeResolver = () => Number;
export const boundsTypeResolver = () => Coords;
export const stringTypeResolver = () => String;
export const stringListTypeResolver = () => [String];
export const booleanTypeResolver = () => Boolean;

@ObjectType()
class PaginatedOccurrenceData extends PaginatedResponse(Occurrence) {}

@ObjectType()
class PaginatedStringData extends PaginatedResponse(String) {}

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
export const stringArrayTypeResolver = () => [String];
export const booleanArrayTypeResolver = () => [Boolean];

@ArgsType()
export class GetFullOccurrenceDataArgs {
  @Field(stringListTypeResolver, { nullable: false })
  selectedIds: string[];
}

@InputType()
export class OccurrenceFilter {
  @Field(stringArrayTypeResolver, { nullable: true })
  country?: [string];

  @Field(stringArrayTypeResolver, { nullable: true })
  species?: [string];

  @Field(booleanArrayTypeResolver, { nullable: true })
  isLarval?: [boolean];

  @Field(booleanArrayTypeResolver, { nullable: true })
  isAdult?: [boolean];

  @Field(booleanArrayTypeResolver, { nullable: true })
  control?: [boolean];

  @Field(stringArrayTypeResolver, { nullable: true })
  season?: [string];

  @Field(integerTypeResolver, { nullable: true })
  startTimestamp?: number;

  @Field(integerTypeResolver, { nullable: true })
  endTimestamp?: number;
}

@InputType()
export class Coords {
  @Field(floatTypeResolver, { nullable: true })
  x: number;
  @Field(floatTypeResolver, { nullable: true })
  y: number;
}

@InputType()
export class BoundsFilter {
  @Field(booleanTypeResolver, { nullable: true })
  locationWindowActive: boolean;

  @Field(boundsTypeResolver, { nullable: true })
  coord1?: Coords;

  @Field(boundsTypeResolver, { nullable: true })
  coord2?: Coords;

  @Field(boundsTypeResolver, { nullable: true })
  coord3?: Coords;

  @Field(boundsTypeResolver, { nullable: true })
  coord4?: Coords;
}

@Resolver(occurrenceClassTypeResolver)
export class OccurrenceResolver {
  constructor(
    private occurrenceService: OccurrenceService,
    private siteService: SiteService,
    private sampleService: SampleService,
    private bionomicsService: BionomicsService,
    private referenceService: ReferenceService,
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
  async OccurrenceData(
    @Args() { take, skip }: GetOccurrenceDataArgs,
    @Args({ name: 'filters', type: () => OccurrenceFilter, nullable: true })
    filters?: OccurrenceFilter,
    @Args({ name: 'bounds', type: () => BoundsFilter, nullable: true })
    bounds?: BoundsFilter,
  ) {
    const { items, total } = await this.occurrenceService.findOccurrences(
      take,
      skip,
      filters,
      bounds,
    );
    return Object.assign(new PaginatedOccurrenceData(), {
      items,
      total,
      hasMore: total > take + skip,
    });
  }

  @Query(occurrenceListClassTypeResolver)
  async FullOccurrenceData(@Args() { selectedIds }: GetFullOccurrenceDataArgs) {
    return await this.occurrenceService.findOccurrencesByIds(selectedIds);
  }

  @Query(occurrencePaginatedCsvListClassTypeResolver)
  async OccurrenceCsvData(
    @Args() { take, skip }: GetOccurrenceDataArgs,
    @Args({ name: 'filters', type: () => OccurrenceFilter, nullable: true })
    filters?: OccurrenceFilter,
  ) {
    const pageOfData = await this.OccurrenceData({ take, skip }, filters);
    const flattenedRepoObject = flattenOccurrenceRepoObject(pageOfData.items);
    const headers = Object.keys(flattenedRepoObject[0]).join(',');
    const csvRows = flattenedRepoObject.map((row) =>
      Object.values(row).join(','),
    );
    return Object.assign(new PaginatedStringData(), {
      items: [headers, ...csvRows],
      total: pageOfData.total,
      hasMore: pageOfData.hasMore,
    });
  }

  @ResolveField('site', siteClassTypeResolver)
  async getSite(@Parent() parent: Occurrence): Promise<Site> {
    return await this.siteService.findOneById(parent.site.id);
  }

  @ResolveField('sample', sampleClassTypeResolver, { nullable: true })
  async getSample(@Parent() parent: Occurrence): Promise<Sample | null> {
    if (parent.sample) {
      return await this.sampleService.findOneById(parent.sample.id);
    }
    return null;
  }

  @ResolveField('bionomics', () => Bionomics, { nullable: true })
  async getBionomics(@Parent() parent: Occurrence): Promise<Bionomics | null> {
    if (parent.bionomics) {
      return await this.bionomicsService.findOneById(parent.bionomics.id);
    }
    return null;
  }

  @ResolveField('reference', referenceClassTypeResolver)
  async getReference(@Parent() parent: Occurrence): Promise<Reference> {
    return await this.referenceService.findOneById(parent.reference.id);
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
