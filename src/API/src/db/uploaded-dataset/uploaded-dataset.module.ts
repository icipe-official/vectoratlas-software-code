import { Module } from '@nestjs/common';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDatasetController } from './uploaded-dataset.controller';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { UploadedDatasetLogModule } from '../uploaded-dataset-log/uploaded-dataset-log.module';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';
import { MailService } from 'src/mailService/mailService.service';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    UploadedDatasetLogModule,
    TypeOrmModule.forFeature([
      UploadedDataset,
      CommunicationLog,
      UploadedDatasetLog,
      DOI,
    ]),
  ],
  controllers: [UploadedDatasetController],
  providers: [
    UploadedDatasetService,
    CommunicationLogService,
    AuthService,
    DoiService,
    MailService
  ],
  exports: [UploadedDatasetService],
})
export class UploadedDatasetModule {}
