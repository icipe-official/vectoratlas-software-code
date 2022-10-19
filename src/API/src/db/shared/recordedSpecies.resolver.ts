import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { SpeciesService } from '../shared/species.service';
import { Species } from '../shared/entities/species.entity';

export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;
export const speciesClassTypeResolver = () => Species;

@Resolver(recordedSpeciesClassTypeResolver)
export class RecordedSpeciesResolver {
  constructor(private speciesService: SpeciesService) {}

  @ResolveField('species', speciesClassTypeResolver)
  async getspecies(@Parent() parent: RecordedSpecies): Promise<Species> {
    return await this.speciesService.findOneById(parent.species.id);
  }
}
