import { Module } from '@nestjs/common';
import { DynamicQueryService } from './dynamic-query.service';
import { DynamicExportService } from './dynamic-export.service';
import { DynamicQueryModule } from './dynamic-query.module';
import { OccurrenceModule } from '../occurrence/occurrence.module';
import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DynamicQueryModule, TypeOrmModule.forFeature([Occurrence])],
  providers: [DynamicExportService],
  exports: [DynamicExportService], // Crucial: allows other modules to use it
})
export class DynamicExportModule {}
