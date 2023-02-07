import { Args, Field, InputType, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { UserRoleService } from './user_role.service';
import { UserRole } from './user_role.entity';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { GqlAuthGuard } from '../gqlAuthGuard';

@ObjectType({ description: 'user role data' })
export class UserWithRoles {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  auth0_id: string;

  @Field({ nullable: true })
  is_uploader: boolean;

  @Field({ nullable: true })
  is_reviewer: boolean;

  @Field({ nullable: true })
  is_admin: boolean;

  @Field({ nullable: true })
  is_editor: boolean;
}

@InputType()
export class UserRoleInput {
  @Field({ nullable: false })
  auth0_id: string;

  @Field({ nullable: true })
  is_uploader: boolean;

  @Field({ nullable: true })
  is_reviewer: boolean;

  @Field({ nullable: true })
  is_admin: boolean;

  @Field({ nullable: true })
  is_editor: boolean;
}


@Resolver()
export class AllUserRolesResolver {
  constructor(private userRoleService: UserRoleService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Query(() => [UserWithRoles])
  async allUserRoles() {
    const allUsersWithRoles = await this.userRoleService.getAllUsersWithRoles();

    return allUsersWithRoles.map(u => ({email: 'TODO', ...u}))
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => UserRole)
  async updateUserRoles(
    @Args({
      name: 'input',
      type: () => UserRoleInput,
      nullable: false,
    })
    userRoles: UserRoleInput,
  ) {
    return this.userRoleService.upsertUserRoles(userRoles);
  }
}