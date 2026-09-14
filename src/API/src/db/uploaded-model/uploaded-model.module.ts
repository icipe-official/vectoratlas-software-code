import { forwardRef, Logger, Module } from '@nestjs/common';
import { UploadedModelService } from './uploaded-model.service';
import { UploadedModelController } from './uploaded-model.controller';
import { UploadedModelLogService } from '../uploaded-model-log/uploaded-model-log.service';
import { DatasetUploadModule } from 'src/dataset-upload/dataset-upload.module';
import { SharedModule } from '../shared/shared.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UploadedModelLog } from '../uploaded-model-log/entities/uploaded-model-log.entity';
import { DOI } from '../doi/entities/doi.entity';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { Dataset } from '../shared/entities/dataset.entity';
import { DoiModule } from '../doi/doi.module';
import { UploadedModel } from './entities/uploaded-model.entity';
import { UploadedModelResolver } from './uploaded-model.resolver';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { AuthService } from 'src/auth/auth.service';
import { DoiService } from '../doi/doi.service';
import { EmailService } from 'src/email/email.service';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { DatasetService } from '../shared/dataset.service';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    DatasetUploadModule,
    forwardRef(() => DoiModule),
    //DoiModule,
    TypeOrmModule.forFeature([
      UploadedModel,
      CommunicationLog,
      UploadedModelLog,
      DOI,
      UserRole,
      Dataset,
    ]),
  ],
  controllers: [UploadedModelController],
  providers: [
    UploadedModelResolver,
    UploadedModelService,
    CommunicationLogService,
    AuthService,
    DoiService,
    EmailService,
    UploadedModelLogService,
    UserRoleService,
    AzureBlobService,
    DatasetService,
    Logger,
  ],
})
export class UploadedModelModule {}
