import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './organization.input';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  // Public: the map and the upload form need these to show credit
  @Query(() => [Organization], { name: 'allOrganizations' })
  async findAll() {
    return this.organizationService.findAll();
  }

  @Query(() => Organization, { name: 'organization', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.organizationService.findOne(id);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Organization)
  async createOrganization(@Args('input') input: CreateOrganizationInput) {
    return this.organizationService.create(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Organization)
  async updateOrganization(@Args('input') input: UpdateOrganizationInput) {
    return this.organizationService.update(input);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Organization)
  async deleteOrganization(@Args('id', { type: () => String }) id: string) {
    return this.organizationService.remove(id);
  }
}
