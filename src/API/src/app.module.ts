import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { GeoDataModule } from './geo_data/geo_data.module';
import { ConfigController } from './config/config.controller';
import { typeOrmModuleOptions } from './db/datasource';
import { BionomicsModule } from './db/bionomics/bionomics.module';
import { OccurrenceModule } from './db/occurrence/occurrence.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    GeoDataModule,
    BionomicsModule,
    OccurrenceModule,
  ],
  controllers: [AppController, ConfigController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
