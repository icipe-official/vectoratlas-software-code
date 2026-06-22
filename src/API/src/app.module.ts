import { Module, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { ConfigController } from './config/config.controller';
import { typeOrmModuleOptions } from './db/datasource';
import { AuthModule } from './auth/auth.module';
import { BionomicsModule } from './db/bionomics/bionomics.module';
import { InsecticideResistanceModule } from './db/insecticideResistance/insecticideResistance.module';
import { OccurrenceModule } from './db/occurrence/occurrence.module';
import { IngestModule } from './ingest/ingest.module';
import { ExportModule } from './export/export.module';
import { SharedModule } from './db/shared/shared.module';
import { SpeciesInformationModule } from './db/speciesInformation/speciesInformation.module';
import { NewsModule } from './db/news/news.module';
import { ModelsModule } from './models/models.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';
import { ReviewModule } from './review/review.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DoiModule } from './db/doi/doi.module';
import { DoiSourceModule } from './db/doi-source/doi-source.module';
import { UploadedDatasetModule } from './db/uploaded-dataset/uploaded-dataset.module';
import { UploadedDatasetLogModule } from './db/uploaded-dataset-log/uploaded-dataset-log.module';
import { CommunicationLogModule } from './db/communication-log/communication-log.module';
import { DatasetUploadModule } from './dataset-upload/dataset-upload.module';
import { EmailModule } from './email/email.module';
import { RequestLoggerMiddleWare } from './request-logger.middleware';
import { UploadedModelLogModule } from './db/uploaded-model-log/uploaded-model-log.module';
import { UploadedModelModule } from './db/uploaded-model/uploaded-model.module';
import { EditLogsModule } from './db/edit-logs/editLogs.module';
import { ExportsModule } from './exports/exports.module';
import { FullOccurrenceDataModule } from './full-occurrence-data/full-occurrence-data.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BlobCleanupService } from './db/shared/blob-cleanup.service';
import { AzureBlobService } from './db/azure-blob/azure-blob.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    ScheduleModule.forRoot(),

    AuthModule,
    BionomicsModule,
    InsecticideResistanceModule,
    OccurrenceModule,
    IngestModule,
    ValidationModule,
    ExportModule,
    SharedModule,
    SpeciesInformationModule,
    NewsModule,
    ModelsModule,
    ReviewModule,
    AnalyticsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    EmailModule,
    DoiModule,
    DoiSourceModule,
    UploadedDatasetModule,
    UploadedDatasetLogModule,
    CommunicationLogModule,
    DatasetUploadModule,
    UploadedModelLogModule,
    UploadedModelModule,
    EditLogsModule,
    ExportsModule,
    FullOccurrenceDataModule,
  ],
  controllers: [ConfigController],
  providers: [AzureBlobService, BlobCleanupService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleWare).forRoutes('*');
  }
}
