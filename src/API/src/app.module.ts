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
import { ReferenceModule } from './db/shared/reference.module';
import { SpeciesInformationModule } from './db/speciesInformation/speciesInformation.module';
import { NewsModule } from './db/news/news.module';
import { ModelsModule } from './models/models.module';
import { AzureModule } from './azure/azure.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AuthModule,
    BionomicsModule,
    OccurrenceModule,
    IngestModule,
    ExportModule,
    ReferenceModule,
    SpeciesInformationModule,
    NewsModule,
    ModelsModule,
    AzureModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
