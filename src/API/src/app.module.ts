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
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CountryModule } from './db/country/country.module';
import { EmailRegistryModule } from './db/email-registry/email-registry.module';

@Module({
  imports: [
    // 1. Load ConfigModule globally first
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),

    // 2. use forRootAsync to ensure ConfigService is available for environment variable access
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = configService.get<string>('REDIS_PASSWORD');
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
            ...(password ? { password } : {}),
          },
        };
      },
      inject: [ConfigService],
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

    // Use forRootAsync to ensure ConfigService is available for environment variable access
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT', 587),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
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
    CountryModule,
    EmailRegistryModule,
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
