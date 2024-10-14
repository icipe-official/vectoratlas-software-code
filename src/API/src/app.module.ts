import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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
//import { DatasetModule } from './dataset/dataset.module';

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
      // transport: {
      //   host: 'smtp.office365.com',
      //   port: 587,
      //   secure: false,
      //   auth: {
      //     user: 'vectoratlas-donotreply@icipe.org',
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // },
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'stevenyaga@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    DoiModule,
    DoiSourceModule,
    UploadedDatasetModule,
    UploadedDatasetLogModule,
    CommunicationLogModule,
   // DatasetModule,
  ],
  controllers: [ConfigController],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
