import { Args, Query, Resolver } from '@nestjs/graphql';
import { BionomicsService } from './bionomics.service';
import { Bionomics } from './entities/bionomics.entity';

@Resolver(() => Bionomics)
export class BionomicsResolver {
  constructor(private bionomicsService: BionomicsService) {}

  @Query(() => Bionomics)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.bionomicsService.findOneById(id);
  }

  @Query(() => [Bionomics])
  async allGeoData() {
    return this.bionomicsService.findAll();
  }
}
