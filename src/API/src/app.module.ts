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
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/user_role/roles.guard';
import { GqlAuthGuard } from './auth/gqlAuthGuard';

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
  ],
  controllers: [ConfigController],
  providers: [ {
    provide: APP_GUARD,
    useClass: GqlAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
