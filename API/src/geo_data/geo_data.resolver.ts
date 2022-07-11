import { Args, Query, Resolver } from "@nestjs/graphql";
import { GeoDataService } from "./geo_data.service";
import { GeoData } from "./geo_data.model";

@Resolver(of => GeoData)
export class GeoDataResolver {
  constructor(
    private geoDataService: GeoDataService,
  ) {}

  @Query(returns => GeoData)
  async geoData(@Args('id', { type: () => String }) id: string) {
    return this.geoDataService.findOneById(id);
  }

  @Query(returns => [GeoData])
  async allGeoData() {
    return this.geoDataService.findAll();
  }
}