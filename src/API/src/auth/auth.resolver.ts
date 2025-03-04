import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gqlAuthGuard';
import { GqlAuthUser } from './user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async requestRoles(
    @Args({
      name: 'requestReason',
      type: () => String,
      nullable: false,
    })
    requestReason: string,
    @Args({
      name: 'rolesRequested',
      type: () => [String],
      nullable: false,
    })
    rolesRequested: [string],
    @Args({
      name: 'email',
      type: () => String,
      nullable: false,
    })
    email: string,
    @GqlAuthUser() user: any,
  ) {
    return this.authService.requestRoles(
      requestReason,
      rolesRequested,
      email,
      user.sub,
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  disableNotifications(
    @Args({
      name: 'userId',
      type: () => String,
      nullable: false,
    })
    userId: string,
    @Args({
      name: 'disable',
      type: () => Boolean,
      nullable: false,
    })
    disable: boolean,
    @GqlAuthUser() user: any,
  ) {
    return this.authService.disableNotifications(userId, disable);
  }
}
