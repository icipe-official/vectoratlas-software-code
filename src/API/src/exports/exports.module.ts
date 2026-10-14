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
import { ExportsProcessorV3 } from './exports.processor-v3';
import { DynamicExportServiceV3 } from 'src/db/shared/dynamic-export.service-v3';

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
    ExportsServiceV2,
    // Only one processor can be active at a time (both bind to the 'exports' queue).
    // To test v3: comment out V2 processor/service and uncomment V3.
    ExportsProcessorV2,
    DynamicExportServiceV2,
    // ExportsProcessorV3,
    // DynamicExportServiceV3,
  ],
  exports: [ExportsServiceV2],
})
export class ExportsModule {}
