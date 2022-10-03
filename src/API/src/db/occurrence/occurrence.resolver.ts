import {
  Args,
  ArgsType,
  Parent,
  Query,
  ResolveField,
  ResolveProperty,
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

// @ObjectType()
// class PaginatedOccurenceData extends PaginatedResponse(Occurrence){}
// @ArgsType()
// class GetLocationDataArgs {
//   @Field(() => Int, { nullable: true, defaultValue: 1 })
//   @Min(1)
//   @Max(100)
//   take: number;

//   @Field(() => Int, { nullable: true, defaultValue: 0 })
//   @Min(0)
//   skip: number;
// }
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

  @ResolveField('site', (returns) => Site)
  async getSite(@Parent() parent: Occurrence): Promise<Site> {
    return await this.siteService.findOneById(parent.site.id);
  }

  @ResolveField('sample', (returns) => Sample)
  async getSample(@Parent() parent: Occurrence): Promise<Sample> {
    return await this.sampleService.findOneById(parent.sample.id);
  }
}
