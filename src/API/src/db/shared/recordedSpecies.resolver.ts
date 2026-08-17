import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RecordedSpeciesService } from './recordedSpecies.service';
import { RecordedSpecies } from './entities/recorded_species.entity';
import { UpdateRecordedSpeciesInput } from './dto/update-recorded-species.input';

export const recordedSpeciesClassTypeResolver = () => RecordedSpecies;

@Resolver(recordedSpeciesClassTypeResolver)
export class RecordedSpeciesResolver {
  constructor(private recordedSpeciesService: RecordedSpeciesService) {}

  @Query(() => [RecordedSpecies])
  async allRecordedSpecies(): Promise<RecordedSpecies[]> {
    return await this.recordedSpeciesService.findAll();
  }

  @Query(() => RecordedSpecies, { nullable: true })
  async recordedSpeciesById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RecordedSpecies | null> {
    return await this.recordedSpeciesService.findOneById(id);
  }
  @Mutation(() => RecordedSpecies)
  async updateRecordedSpecies(
    @Args('input') input: UpdateRecordedSpeciesInput,
  ): Promise<RecordedSpecies> {
    return await this.recordedSpeciesService.update(input);
  }
}
