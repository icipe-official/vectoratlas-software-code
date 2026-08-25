import {
  Args,
  Field,
  InputType,
  Mutation,
  Parent,
  Query,
  ResolveField,
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

  // Base64-encoded image bytes (from uploadImage's imageBase64 response),
  // decoded to a Buffer in createEditSpeciesInformation before saving.
  @Field({ nullable: true })
  speciesImage: string;

  // Base64-encoded WebP preview bytes (from uploadImage's previewBase64).
  @Field({ nullable: true })
  previewImage: string;

  @Field(() => [String])
  citations?: string[];

  @Field()
  link: string;
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

  // Converts the stored bytea Buffer to a base64 string whenever a query
  // actually asks for speciesImage. List queries that don't request this
  // field never trigger it — allSpeciesInformation's service method
  // already excludes speciesImage from its select for exactly this reason.
  @ResolveField('speciesImage', () => String, { nullable: true })
  resolveSpeciesImage(@Parent() species: SpeciesInformation): string | null {
    return species.speciesImage
      ? species.speciesImage.toString('base64')
      : null;
  }

  @ResolveField('previewImage', () => String, { nullable: true })
  resolvePreviewImage(@Parent() species: SpeciesInformation): string | null {
    return species.previewImage
      ? species.previewImage.toString('base64')
      : null;
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
      // Decode base64 strings from the frontend back into raw bytes
      // for storage in the bytea columns.
      speciesImage: input.speciesImage
        ? Buffer.from(input.speciesImage, 'base64')
        : null,
      previewImage: input.previewImage
        ? Buffer.from(input.previewImage, 'base64')
        : null,
      distributionMapUrl: '',
      citations: input.citations ?? [],
    };

    return this.speciesInformationService.upsertSpeciesInformation(
      newSpeciesInformation,
    );
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Mutation(() => Boolean)
  async deleteSpeciesInformation(
    @Args('id', { type: () => String }) id: string,
  ): Promise<boolean> {
    return this.speciesInformationService.deleteSpeciesInformation(id);
  }
}
