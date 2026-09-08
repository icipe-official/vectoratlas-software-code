import { Logger, Module } from '@nestjs/common';
import { ModelProcessingStatus, ModelsResolver } from './models.resolver';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { ModelsTransformationService } from './modelsTransformation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedModel } from 'src/db/uploaded-model/entities/uploaded-model.entity';
import { UploadedModelService } from 'src/db/uploaded-model/uploaded-model.service';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { HttpModule } from '@nestjs/axios';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { UploadedModelLogService } from 'src/db/uploaded-model-log/uploaded-model-log.service';
import { UploadedModelLog } from 'src/db/uploaded-model-log/entities/uploaded-model-log.entity';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { DatasetService } from 'src/db/shared/dataset.service';
import { DoiService } from 'src/db/doi/doi.service';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { DOI } from 'src/db/doi/entities/doi.entity';
import { EmailModule } from 'src/email/email.module';
// import { ModelLogResolver } from './model-log/model-log.resolver';

@Module({
  imports: [
    HttpModule,
    EmailModule,
    ModelProcessingStatus,
    TypeOrmModule.forFeature([
      UploadedModel,
      UserRole,
      UploadedModelLog,
      CommunicationLog,
      Dataset,
      DOI,
    ]),
  ],
  controllers: [ModelsController],
  providers: [
    ModelsService,
    ModelsTransformationService,
    ModelsResolver,
    Logger,
    AuthService,
    // EmailService,
    UserRoleService,
    UploadedModelLogService,
    UploadedModelService,
    CommunicationLogService,
    AzureBlobService,
    DatasetService,
    DoiService,
    // ModelLogResolver,
  ],
  exports: [ModelsService, ModelsResolver],
})
export class ModelsModule {}
