import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { InsecticideResistanceResolver } from './insecticideResistance.resolver';
import { insecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

@Module({
  imports: [TypeOrmModule.forFeature([insecticideResistanceBioassays])],
  providers: [InsecticideResistanceService, InsecticideResistanceResolver],
  exports: [InsecticideResistanceService],
})
export class InsecticideResistanceModule {}
