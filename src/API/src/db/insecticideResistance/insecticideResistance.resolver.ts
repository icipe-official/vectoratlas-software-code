import { Args, Query, Resolver } from '@nestjs/graphql';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { insecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

export const insecticideResistanceTypeResolver = () => insecticideResistanceBioassays;

@Resolver(insecticideResistanceTypeResolver)
export class InsecticideResistanceResolver {
  constructor(private insecticideResistanceService: InsecticideResistanceService) {}

}
