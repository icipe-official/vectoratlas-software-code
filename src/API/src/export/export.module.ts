import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportController } from './export.controller';
import { AllDataFileBuilder } from '../builder/allDataFileBuilder.service';
import { ExportService } from './export.service';
import { OccurrenceModule } from '../db/occurrence/occurrence.module';
import { typeOrmModuleOptions } from '../db/datasource';
import { Occurrence } from '../db/occurrence/entities/occurrence.entity';

@Module({
  imports: [
    OccurrenceModule,
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    TypeOrmModule.forFeature([Occurrence]),
  ],
  providers: [Logger, ExportService, AllDataFileBuilder],
  controllers: [ExportController],
  exports: [ExportService],
})
export class ExportModule {}
