import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InsecticideResistanceService } from './insecticideResistance.service';
import { InsecticideResistanceResolver } from './insecticideResistance.resolver';
import { InsecticideResistanceBioassays } from './entities/insecticideResistanceBioassays.entity';
import { Rdl296GenotypeFrequencies } from './entities/rdl296GenotypeFrequencies.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InsecticideResistanceBioassays,
      Rdl296GenotypeFrequencies,
    ]),
  ],
  providers: [InsecticideResistanceService, InsecticideResistanceResolver],
  exports: [TypeOrmModule, InsecticideResistanceService],
})
export class InsecticideResistanceModule {}
