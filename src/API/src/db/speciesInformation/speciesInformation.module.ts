import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SpeciesInformation } from './entities/speciesInformation.entity';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformationResolver } from './speciesInformation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesInformation])],
  providers: [SpeciesInformationService, SpeciesInformationResolver],
  exports: [SpeciesInformationService, SpeciesInformationResolver],
})
export class SpeciesInformationModule {}
