import { Args, Query, Resolver } from '@nestjs/graphql';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

export const insecticideResistanceTypeResolver = () =>
  InsecticideResistanceBioassays;

@Resolver(insecticideResistanceTypeResolver)
export class InsecticideResistanceResolver {
  constructor(
    private insecticideResistanceService: InsecticideResistanceService,
  ) {}
  @Query(insecticideResistanceTypeResolver, {
    name: 'insecticideResistanceById',
  })
  async getInsecticideResistanceById(
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.insecticideResistanceService.findOneById(id);
  }
}
