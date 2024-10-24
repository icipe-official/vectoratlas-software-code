import { Logger, Module } from '@nestjs/common';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDatasetController } from './uploaded-dataset.controller';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { AuthService } from 'src/auth/auth.service'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';
import { UploadedDatasetResolver } from './uploaded-dataset.resolver';
import { UploadedDatasetLogService } from '../uploaded-dataset-log/uploaded-dataset-log.service';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      UploadedDataset,
      CommunicationLog,
      UploadedDatasetLog,
      DOI,
      UserRole,
    ]),
  ],
  controllers: [UploadedDatasetController],
  providers: [
    UploadedDatasetResolver,
    UploadedDatasetService,
    CommunicationLogService,
    AuthService,
    DoiService,
    Logger,
    EmailService,
    UploadedDatasetLogService,
    UserRoleService,
  ],
  exports: [UploadedDatasetService],
})
export class UploadedDatasetModule {}
