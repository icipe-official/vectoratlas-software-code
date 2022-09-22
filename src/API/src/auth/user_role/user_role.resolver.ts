import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserRoleService } from './user_role.service';
import { UserRole } from './user_role.entity';

@Resolver(() => UserRole)
export class UserRoleResolver {
  constructor(private userRoleService: UserRoleService) {}

  @Query(() => UserRole)
  async userRole(@Args('id', { type: () => String }) id: string) {
    return this.userRoleService.findOneById(id);
  }
}
