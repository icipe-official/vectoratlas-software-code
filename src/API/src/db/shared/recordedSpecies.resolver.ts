import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';

export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;

@Resolver(recordedSpeciesClassTypeResolver)
export class RecordedSpeciesResolver {
  constructor() {}
}
