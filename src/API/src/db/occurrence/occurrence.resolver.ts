import {
  Args,
  Parent,
  Query,
  ResolveField,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';
import { Site } from '../shared/entities/site.entity';
import { SiteService } from '../shared/site.service';
import { Sample } from './entities/sample.entity';
import { SampleService } from './sample.service';

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
