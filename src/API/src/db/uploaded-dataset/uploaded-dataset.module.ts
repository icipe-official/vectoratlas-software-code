import { Logger, Module } from '@nestjs/common';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDatasetController } from './uploaded-dataset.controller';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { HttpModule } from '@nestjs/axios';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { UploadedDatasetLogModule } from '../uploaded-dataset-log/uploaded-dataset-log.module';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';
import { UploadedDatasetResolver } from './uploaded-dataset.resolver';
import { MailService } from 'src/mailService/mailService.service';
import { MailServiceModule } from 'src/mailService/mailService.module';
import { MailerModule } from '@nestjs-modules/mailer';

// importing ConfigModule under MailerModule
// MailerModule.forRootAsync({
// imports: [ConfigModule], //


@Module({
  imports: [
    AuthModule,
    HttpModule,
    UploadedDatasetLogModule,
    MailServiceModule,
    MailerModule,
    TypeOrmModule.forFeature([
      UploadedDataset,
      CommunicationLog,
      UploadedDatasetLog,
      DOI,
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
    MailService,
  ],
  exports: [UploadedDatasetService],
})
export class UploadedDatasetModule {}
