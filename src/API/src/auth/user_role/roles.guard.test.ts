import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if no required roles', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(null);
    const context = createMock<ExecutionContext>();
    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should return true if user has required role', () => {
    const gqlExecutionContext = createMock<GqlExecutionContext>();
    gqlExecutionContext.getContext = jest.fn().mockReturnValue({
      req: {
        user: {
          scope: 'uploader',
        },
      },
    });
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext);
    reflector.getAllAndOverride = jest.fn().mockReturnValue([Role.Uploader]);
    const context = createMock<ExecutionContext>();
    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should return false if user does not have required role', () => {
    const gqlExecutionContext = createMock<GqlExecutionContext>();
    gqlExecutionContext.getContext = jest.fn().mockReturnValue({
      req: {
        user: {
          scope: 'admin',
        },
      },
    });
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext);
    reflector.getAllAndOverride = jest.fn().mockReturnValue([Role.Uploader]);
    const context = createMock<ExecutionContext>();
    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(false);
  });

  it('should return true if user does not have all required roles', () => {
    const gqlExecutionContext = createMock<GqlExecutionContext>();
    gqlExecutionContext.getContext = jest.fn().mockReturnValue({
      req: {
        user: {
          scope: 'admin',
        },
      },
    });
    jest
      .spyOn(GqlExecutionContext, 'create')
      .mockReturnValue(gqlExecutionContext);
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue([Role.Uploader, Role.Admin]);
    const context = createMock<ExecutionContext>();
    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });
});
