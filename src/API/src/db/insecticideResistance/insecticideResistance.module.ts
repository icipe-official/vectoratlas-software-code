import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { InsecticideResistanceResolver } from './insecticideResistance.resolver';
import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InsecticideResistanceBioassays])],
  providers: [InsecticideResistanceService, InsecticideResistanceResolver],
  exports: [InsecticideResistanceService],
})
export class InsecticideResistanceModule {}
