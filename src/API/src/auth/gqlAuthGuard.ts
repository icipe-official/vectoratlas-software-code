import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'njwt';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    console.log(jwt.verify(ctx.getContext().req.headers.authorization.slice(7), 'apr8TOuQHVELHF9MJckAOQL/M98='))
    return ctx.getContext().req;
  }
}