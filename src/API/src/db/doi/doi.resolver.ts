import { Args, Query, Resolver } from '@nestjs/graphql';
import { DOI } from './entities/doi.entity';
import { DoiService } from './doi.service';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UserRole } from 'src/auth/user_role/user_role.entity';

export const doiClassTypeResolver = () => DOI;
export const doiListClassTypeResolver = () => [DOI];

@Resolver(doiClassTypeResolver)
export class DoiResolver {
  constructor(private doiService: DoiService) {}

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(doiClassTypeResolver, { nullable: true })
  async doiById(@Args('id', { type: () => String }) id: string) {
    return await this.doiService.getDOI(id);
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(doiListClassTypeResolver)
  async allDois() {
    return await this.doiService.getDOIs();
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  @Query(doiListClassTypeResolver)
  async allDoisByStatus(
    @Args('status', { type: () => String }) status: string,
  ) {
    return await this.doiService.getDOIsByStatus(status);
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Roles(Role.Uploader)
  @Query(doiClassTypeResolver, { nullable: true })
  async approveDoi(
    @Args('id', { type: () => String }) id: string,
    @Args('comments', { type: () => String }) comments: string,
    @Args('recipients', { type: () => [String] }) recipients?: [string],
  ) {
    return await this.doiService.approveDOI(id, comments, recipients);
  }

  // @UseGuards(GqlAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // @Roles(Role.Uploader)
  @Query(doiClassTypeResolver, { nullable: true })
  async rejectDoi(
    @Args('id', { type: () => String }) id: string,
    @Args('comments', { type: () => String }) comments: string,
    @Args('recipients', { type: () => [String] }) recipients?: [string],
  ) {
    return await this.doiService.rejectDOI(id, comments, recipients);
  }
}
