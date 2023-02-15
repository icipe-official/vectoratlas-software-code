import {
  Args,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UserRoleService } from './user_role.service';
import { UserRole } from './user_role.entity';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { GqlAuthGuard } from '../gqlAuthGuard';
import { AuthService } from '../auth.service';

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
  constructor(
    private userRoleService: UserRoleService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Query(() => [UserWithRoles])
  async allUserRoles() {
    const allUsersWithRolesInDB =
      await this.userRoleService.getAllUsersWithRoles();

    await this.authService.init();
    const auth0Users = await this.authService.getAllUsers();

    const allUsers = auth0Users.map((u) => ({
      email: u.email,
      auth0_id: u.user_id,
      is_admin: false,
      is_uploader: false,
      is_reviewer: false,
      is_editor: false,
    }));

    allUsersWithRolesInDB.forEach((u) => {
      const matchingUser = allUsers.find(
        (user) => user.auth0_id === u.auth0_id,
      );
      if (matchingUser) {
        matchingUser.is_admin = u.is_admin;
        matchingUser.is_uploader = u.is_uploader;
        matchingUser.is_reviewer = u.is_reviewer;
        matchingUser.is_editor = u.is_editor;
      }
    });

    return allUsers.sort((a, b) => (a.email > b.email ? 1 : -1));
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
