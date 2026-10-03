import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ExportJob } from './export-job.entity';
import { ExportsController } from './exports.controller';
import { ExportsRepository } from './exports.repository';
import { OccurrenceModule } from '../db/occurrence/occurrence.module';
import { DoiModule } from '../db/doi/doi.module';
import { EmailModule } from '../email/email.module';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { DOI } from '../db/doi/entities/doi.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { ExportsServiceV2 } from './exports.service-v2';
import { ExportsProcessorV2 } from './exports.processor-v2';
import { DynamicExportServiceV2 } from 'src/db/shared/dynamic-export.service-v2';
@Module({
  imports: [
    TypeOrmModule.forFeature([ExportJob, DOI, Occurrence]),
    BullModule.registerQueue({
      name: 'exports',
    }),
    OccurrenceModule,
    forwardRef(() => DoiModule),
    EmailModule,
  ],
  controllers: [ExportsController],
  providers: [
    ExportsRepository,
    AzureBlobService,
    // V2 Services (only v2 versions are active)
    ExportsServiceV2,
    ExportsProcessorV2,
    DynamicExportServiceV2,
  ],
  exports: [ExportsServiceV2],
})
export class ExportsModule {}
