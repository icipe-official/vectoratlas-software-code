import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { ConfigController } from './config/config.controller';
import { ExportController } from './export/export.controller';
import { typeOrmModuleOptions } from './db/datasource';
import { AuthModule } from './auth/auth.module';
import { BionomicsModule } from './db/bionomics/bionomics.module';
import { OccurrenceModule } from './db/occurrence/occurrence.module';
import { IngestModule } from './ingest/ingest.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    AuthModule,
    BionomicsModule,
    OccurrenceModule,
    IngestModule,
  ],
  controllers: [ConfigController, ExportController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
