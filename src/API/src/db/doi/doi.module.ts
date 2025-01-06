import { forwardRef, Logger, Module } from '@nestjs/common';
import { DoiService } from './doi.service';
import { DoiController } from './doi.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { DoiResolver } from './doi.resolver';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { EmailModule } from '../../email/email.module';
import { EmailService } from '../../email/email.service';
import { Email } from '../../email/entities/email.entity';
import { CommunicationLogModule } from '../communication-log/communication-log.module';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetService } from '../uploaded-dataset/uploaded-dataset.service';
import { UploadedDatasetModule } from '../uploaded-dataset/uploaded-dataset.module';
import { UploadedDatasetLogModule } from '../uploaded-dataset-log/uploaded-dataset-log.module';

@Module({
  imports: [
    HttpModule,
    // forwardRef(() => UploadedDatasetModule),
    TypeOrmModule.forFeature([DOI, CommunicationLog, Email, UploadedDataset]),
  ],
  controllers: [DoiController],
  providers: [
    DoiResolver,
    DoiService,
    EmailService,
    CommunicationLogService,
    Logger,
  ],
  exports: [DoiService],
})
export class DoiModule {}
