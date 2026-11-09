import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SpeciesService } from './species.service';
import { Species } from './entities/species.entity';
import { UpdateSpeciesInput } from './entities/species.input';

@Resolver(() => Species)
export class SpeciesResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => [Species], { name: 'allSpecies' })
  findAll() {
    return this.speciesService.findAll();
  }

  @Query(() => Species, { name: 'species', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.speciesService.findOne(id);
  }

  @Query(() => Species, { name: 'speciesByName', nullable: true })
  findByName(@Args('name', { type: () => String }) name: string) {
    return this.speciesService.findByName(name);
  }

  @Mutation(() => Species)
  updateSpecies(@Args('input') input: UpdateSpeciesInput) {
    return this.speciesService.update(input.id, input as any);
  }
}
