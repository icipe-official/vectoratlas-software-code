import { Module } from '@nestjs/common';
import { DatasetService } from './dataset.service';
import { DatasetResolver } from './dataset.resolver';
import { Dataset } from './entities/dataset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetController } from './dataset.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dataset])],
  providers: [DatasetService, DatasetResolver],
  controllers: [DatasetController]
})
export class DatasetModule {}
