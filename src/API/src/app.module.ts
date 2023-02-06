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
import { OccurrenceModule } from './db/occurrence/occurrence.module';
import { IngestModule } from './ingest/ingest.module';
import { ExportModule } from './export/export.module';
import { SharedModule } from './db/shared/reference.module';
import { SpeciesInformationModule } from './db/speciesInformation/speciesInformation.module';
import { NewsModule } from './db/news/news.module';
import { ModelsModule } from './models/models.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { ValidationModule } from './validation/validation.module';

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
    OccurrenceModule,
    IngestModule,
    ValidationModule,
    ExportModule,
    SharedModule,
    SpeciesInformationModule,
    NewsModule,
    ModelsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'vectoratlas-donotreply@icipe.org',
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [ConfigController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
