import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GeoDataService } from './geo_data.service';
import { GeoDataResolver } from './geo_data.resolver';
import { GeoData } from './geo_data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeoData])],
  providers: [GeoDataService, GeoDataResolver],
  exports: [GeoDataService],
})
export class GeoDataModule {}
