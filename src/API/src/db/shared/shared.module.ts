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
import { DatasetController } from './dataset.controller';
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Reference]),
    TypeOrmModule.forFeature([Dataset]),
  ],
  providers: [
    ReferenceService,
    ReferenceResolver,
    DatasetService,
    DatasetResolver,
    AuthService,
  ],
  exports: [ReferenceService, DatasetService],
  controllers: [DatasetController],
})
export class SharedModule {}
