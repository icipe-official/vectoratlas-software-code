import { Logger, Module } from '@nestjs/common';
import { DynamicExportService } from './dynamic-export.service';
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
import { ExportsService } from 'src/exports/exports.service';
import { ExportJob } from 'src/exports/export-job.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    DynamicQueryModule,
    EmailModule,
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
    DynamicExportService,
    DoiService,
    //EmailService,
    AuthService,
    Logger,
    CommunicationLogService,
    UserRoleService,
    AzureBlobService,
    BlobCleanupService,
    ExportsService,
  ],
  exports: [DynamicExportService], // Crucial: allows other modules to use it
})
export class DynamicExportModule {}
