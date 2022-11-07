import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceResolver } from './reference.resolver';
import { Reference } from './entities/reference.entity';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/user_role/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Reference]), AuthModule],
  providers: [ReferenceService, ReferenceResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
  exports: [ReferenceService],
})
export class ReferenceModule {}
