import { Logger, Module } from '@nestjs/common';
import { DynamicExportService } from './dynamic-export.service';
import { DynamicExportServiceV2 } from './dynamic-export.service-v2';
import { DynamicQueryModule } from './dynamic-query.module';
import { Occurrence } from '../occurrence/entities/occurrence.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoiService } from '../doi/doi.service';
import { DOI } from '../doi/entities/doi.entity';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { BlobCleanupService } from './blob-cleanup.service';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { ExportsServiceV2 } from 'src/exports/exports.service-v2';
import { ExportJob } from 'src/exports/export-job.entity';

@Module({
  imports: [
    DynamicQueryModule,
    HttpModule,
    TypeOrmModule.forFeature([
      Occurrence,
      DOI,
      CommunicationLog,
      UserRole,
      ExportJob,
    ]),
  ],
  providers: [
    // V1 Services (disabled in favor of v2)
    // DynamicExportService,
    DoiService,
    EmailService,
    AuthService,
    Logger,
    CommunicationLogService,
    UserRoleService,
    AzureBlobService,
    BlobCleanupService,
    // V2 Services (active)
    ExportsServiceV2,
    DynamicExportServiceV2,
  ],
  exports: [DynamicExportServiceV2], // Only v2 service exported
})
export class DynamicExportModule {}
