import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { SpeciesService } from './species.service';
import { SpeciesResolver } from './species.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Species])],
  providers: [SpeciesService, SpeciesResolver],
  exports: [SpeciesService],
})
export class SpeciesModule {}
