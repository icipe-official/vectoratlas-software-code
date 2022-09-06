import { Args, Query, Resolver } from '@nestjs/graphql';
import { OccurrenceService } from './occurrence.service';
import { Occurrence } from './entities/occurrence.entity';

@Resolver(() => Occurrence)
export class OccurrenceResolver {
  constructor(private occurrenceService: OccurrenceService) {}

  @Query(() => Occurrence)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.occurrenceService.findOneById(id);
  }

  @Query(() => [Occurrence])
  async allGeoData() {
    return this.occurrenceService.findAll();
  }
}
