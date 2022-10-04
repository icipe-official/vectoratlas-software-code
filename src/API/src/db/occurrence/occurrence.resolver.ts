import {
  Args,
  ArgsType,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Int,
  Field,
  ObjectType
} from '@nestjs/graphql';
import { Max, Min } from '@nestjs/class-validator';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { Site } from '../shared/entities/site.entity';
import { SiteService } from '../shared/site.service';
import { Sample } from './entities/sample.entity';
import { SampleService } from './sample.service';
import PaginatedResponse from 'src/pagination/pagination';

export const OccurrenceDataListClassTypeResolver = () => PaginatedOccurrenceData

@ObjectType()
class PaginatedOccurrenceData extends PaginatedResponse(Occurrence){}
@ArgsType()
class GetOccurrenceDataArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  @Max(100)
  take: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;
 }

@Resolver(() => Occurrence)
export class OccurrenceResolver {
  constructor(
    private occurrenceService: OccurrenceService,
    private siteService: SiteService,
    private sampleService: SampleService,
  ) {}

  @Query(() => Occurrence)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.occurrenceService.findOneById(id);
  }

  @Query(() => [Occurrence])
  async allGeoData() {
    return this.occurrenceService.findAll();
  }

  @Query(() => PaginatedOccurrenceData)
  async OccurrenceData(
    @Args() {take, skip} : GetOccurrenceDataArgs ) {
      const { items, total } = await this.occurrenceService.findLocations(take, skip);
      console.log(items, total)
      return Object.assign(new PaginatedOccurrenceData(), {items, total, hasMore: total > take + skip});
  }

  @ResolveField('site', (returns) => Site)
  async getSite(@Parent() parent: Occurrence): Promise<Site> {
    return await this.siteService.findOneById(parent.site.id);
  }

  @ResolveField('sample', (returns) => Sample)
  async getSample(@Parent() parent: Occurrence): Promise<Sample> {
    return await this.sampleService.findOneById(parent.sample.id);
  }
}
