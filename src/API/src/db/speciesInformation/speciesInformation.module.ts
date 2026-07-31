import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SpeciesInformation } from './entities/speciesInformation.entity';
import { SpeciesInformationService } from './speciesInformation.service';
import { SpeciesInformationResolver } from './speciesInformation.resolver';
import { SpeciesInformationController } from './speciesInformation.controller';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpeciesInformation])],
  // This was previously an empty array — meaning your REST endpoints
  // (upload-image, download-image, images/:filename) were never
  // actually reachable. Registering the controller here fixes that.
  controllers: [SpeciesInformationController],
  providers: [
    SpeciesInformationService,
    SpeciesInformationResolver,
    AzureBlobService,
  ],
  exports: [SpeciesInformationService, SpeciesInformationResolver],
})
export class SpeciesInformationModule {}
