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
    requestReason: String,
    @Args({
      name: 'rolesRequested',
      type: () => [String],
      nullable: false,
    })
    rolesRequested: [String],
    @Args({
      name: 'email',
      type: () => String,
      nullable: false,
    })
    email: String,
    @GqlAuthUser() user: any,
  ) {
    return this.authService.requestRoles(requestReason, rolesRequested, email, user.sub);
  }}
