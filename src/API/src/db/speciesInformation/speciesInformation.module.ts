import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SpeciesInformation } from './entities/speciesInformation.entity';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformationResolver } from './speciesInformation.resolver';

import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesInformation])],
  controllers: [],
  providers: [
    SpeciesInformationService,
    SpeciesInformationResolver,
    AzureBlobService,
  ],
  exports: [SpeciesInformationService, SpeciesInformationResolver],
})
export class SpeciesInformationModule {}
