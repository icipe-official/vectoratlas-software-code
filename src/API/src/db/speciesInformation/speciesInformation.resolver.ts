import { Args, Query, Resolver } from '@nestjs/graphql';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformation } from './entities/speciesInformation.entity';

export const speciesInformationClassTypeResolver = () => SpeciesInformation;
export const speciesInformationListClassTypeResolver = () => [
  SpeciesInformation,
];

@Resolver(speciesInformationClassTypeResolver)
export class SpeciesInformationResolver {
  constructor(private speciesInformationService: SpeciesInformationService) {}

  @Query(speciesInformationClassTypeResolver)
  async speciesInformationById(@Args('id', { type: () => String }) id: string) {
    return await this.speciesInformationService.speciesInformationById(id);
  }

  @Query(speciesInformationListClassTypeResolver)
  async allSpeciesInformation() {
    return await this.speciesInformationService.allSpeciesInformation();
  }
}
