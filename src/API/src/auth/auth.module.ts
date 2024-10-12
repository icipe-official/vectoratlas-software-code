import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user_role/user_role.entity';
import { UserRoleService } from './user_role/user_role.service';
import { UserRoleResolver } from './user_role/user_role.resolver';
import { VaStrategy } from './va.strategy';
import { RolesGuard } from './user_role/roles.guard';
import { GqlAuthGuard } from './gqlAuthGuard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AllUserRolesResolver } from './user_role/all_user_roles.resolver';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLogModule } from 'src/db/communication-log/communication-log.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRole]),
    HttpModule,
    CommunicationLogModule,
  ],
  providers: [
    JwtStrategy,
    UserRoleService,
    UserRoleResolver,
    AllUserRolesResolver,
    VaStrategy,
    RolesGuard,
    GqlAuthGuard,
    AuthResolver,
    AuthService,
  ],
  exports: [
    PassportModule,
    UserRoleService,
    RolesGuard,
    GqlAuthGuard,
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
