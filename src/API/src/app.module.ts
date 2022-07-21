import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { GeoDataEntity } from './geo_data/geo_data.entity';
import { GeoDataModule } from './geo_data/geo_data.module';
import { ConfigController } from './config/config.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'mva',
      entities: [GeoDataEntity],
      synchronize: false,
    }),
    GeoDataModule,
  ],
  controllers: [AppController, ConfigController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
