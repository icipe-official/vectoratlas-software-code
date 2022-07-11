import { GeoData } from './geo_data.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GeoDataService } from './geo_data.service';
import { GeoDataResolver } from './geo_data.resolver';
import { GeoDataEntity } from './geo_data.entity';


@Module({
  imports: [TypeOrmModule.forFeature([GeoDataEntity])],
  providers: [GeoDataService, GeoDataResolver],
  exports: [GeoDataService]
})
export class GeoDataModule {}