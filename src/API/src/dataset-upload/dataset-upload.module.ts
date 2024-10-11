import { Logger, Module } from '@nestjs/common';
import { DatasetUploadService } from './dataset-upload.service';
import { DatasetUploadController } from './dataset-upload.controller';
import { UploadedDataset } from 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationService } from 'src/validation/validation.service';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { HttpModule } from '@nestjs/axios';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { UploadedDatasetService } from 'src/db/uploaded-dataset/uploaded-dataset.service';
import { CommunicationLogModule } from 'src/db/communication-log/communication-log.module';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';
import { UploadedDatasetLogModule } from 'src/db/uploaded-dataset-log/uploaded-dataset-log.module';
import { UploadedDatasetLogService } from 'src/db/uploaded-dataset-log/uploaded-dataset-log.service';
import { DoiService } from 'src/db/doi/doi.service';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { UploadedDatasetModule } from 'src/db/uploaded-dataset/uploaded-dataset.module';
import { UploadedDatasetLog } from 'src/db/uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { DoiModule } from 'src/db/doi/doi.module';
import { DOI } from 'src/db/doi/entities/doi.entity';

@Module({
  controllers: [DatasetUploadController],
  providers: [
    Logger,
    ValidationService,
    AuthService,
    UserRoleService,
    DatasetUploadService,
    UploadedDatasetService,
    CommunicationLogService,
    UploadedDatasetLogService,
    DoiService,
  ],
  imports: [
    HttpModule,
    DoiModule,
    UploadedDatasetModule,
    UploadedDatasetLogModule,
    CommunicationLogModule,
    UploadedDatasetLogModule,
    TypeOrmModule.forFeature([
      DOI,
      UploadedDataset,
      UploadedDatasetLog,
      UserRole,
      CommunicationLog,
    ]),
  ],
})
export class DatasetModule {}
