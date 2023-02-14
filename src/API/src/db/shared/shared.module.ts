import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceResolver } from './reference.resolver';
import { Reference } from './entities/reference.entity';
import { DatasetService } from './dataset.service';
import { DatasetResolver } from './dataset.resolver';
import { Dataset } from './entities/dataset.entity';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Reference]),
    TypeOrmModule.forFeature([Dataset]),
    TypeOrmModule.forFeature([UserRole]),
  ],
  providers: [
    ReferenceService,
    ReferenceResolver,
    DatasetService,
    DatasetResolver,
    AuthService,
    UserRoleService,
  ],
  exports: [ReferenceService, DatasetService],
})
export class SharedModule {}
