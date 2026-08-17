import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ExportJob } from './export-job.entity';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';
import { ExportsRepository } from './exports.repository';
import { ExportsProcessor } from './exports.processor';
import { OccurrenceModule } from '../db/occurrence/occurrence.module';
import { DoiModule } from '../db/doi/doi.module';
import { EmailModule } from '../email/email.module'; // Import the EmailModule
import { DynamicExportModule } from 'src/db/shared/dynamic-export.module';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { DOI } from '../db/doi/entities/doi.entity';
import { DynamicExportService } from 'src/db/shared/dynamic-export.service';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ExportJob, DOI, Occurrence]),
    BullModule.registerQueue({
      name: 'exports',
    }),
    OccurrenceModule,
    forwardRef(() => DoiModule),
    EmailModule,
    //DynamicExportModule,
  ],
  controllers: [ExportsController],
  providers: [
    ExportsService,
    ExportsRepository,
    ExportsProcessor,
    AzureBlobService,
    DynamicExportService,
  ],
  exports: [ExportsService],
})
export class ExportsModule {}
