import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './user_role/user_role.entity';
import { UserRoleService } from './user_role/user_role.service';
import { UserRoleResolver } from './user_role/user_role.resolver';
import { VaStrategy } from './va.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRole]),
  ],
  providers: [JwtStrategy, UserRoleService, UserRoleResolver, VaStrategy],
  exports: [PassportModule, UserRoleService],
  controllers: [AuthController],
})
export class AuthModule {}
