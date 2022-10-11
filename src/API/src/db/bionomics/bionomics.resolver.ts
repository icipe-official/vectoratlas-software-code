import { Args, Query, Resolver } from '@nestjs/graphql';
import { BionomicsService } from './bionomics.service';
import { Bionomics } from './entities/bionomics.entity';

export const bionomicsTypeResolver = () => Bionomics;
export const bionomicsListTypeResolver = () => Bionomics;

@Resolver(bionomicsTypeResolver)
export class BionomicsResolver {
  constructor(private bionomicsService: BionomicsService) {}

  @Query(bionomicsTypeResolver)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.bionomicsService.findOneById(id);
  }

  @Query(bionomicsListTypeResolver)
  async allGeoData() {
    return this.bionomicsService.findAll();
  }
}
