import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformation } from './entities/speciesInformation.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { v4 as uuidv4 } from 'uuid';

export const speciesInformationClassTypeResolver = () => SpeciesInformation;
export const speciesInformationListClassTypeResolver = () => [
  SpeciesInformation,
];

@InputType()
export class CreateSpeciesInformationInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  name: string;

  @Field()
  shortDescription: string;

  @Field()
  description: string;

  @Field()
  speciesImage: string;
}

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

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Mutation(() => SpeciesInformation)
  async createEditSpeciesInformation(
    @Args({
      name: 'input',
      type: () => CreateSpeciesInformationInput,
      nullable: false,
    })
    input: CreateSpeciesInformationInput,
  ) {
    const newSpeciesInformation: SpeciesInformation = {
      id: input.id ?? uuidv4(),
      ...input,
      distributionMapUrl: '',
    };

    return this.speciesInformationService.upsertSpeciesInformation(
      newSpeciesInformation,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Mutation(() => Boolean) // Return Boolean to indicate success or failure
  async deleteSpeciesInformation(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.speciesInformationService.deleteSpeciesInformation(id);
  }

}
