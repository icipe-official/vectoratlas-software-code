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
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRole, CommunicationLog]),
    HttpModule,
    EmailModule,
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
    EmailService,
    CommunicationLogService,
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
