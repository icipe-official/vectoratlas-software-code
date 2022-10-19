import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceResolver } from './occurrence.resolver';
import { Occurrence } from './entities/occurrence.entity';
import { SiteService } from '../shared/site.service';
import { Site } from '../shared/entities/site.entity';
import { SampleService } from './sample.service';
import { Sample } from './entities/sample.entity';
import { RecordedSpeciesService } from '../shared/recordedSpecies.service';
import { RecordedSpecies } from '../shared/entities/recorded_species.entity';
import { SpeciesService } from '../shared/species.service';
import { Species } from '../shared/entities/species.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Occurrence,
      Site,
      Sample,
      RecordedSpecies,
      Species,
    ]),
  ],
  providers: [
    OccurrenceService,
    OccurrenceResolver,
    SiteService,
    SampleService,
    RecordedSpeciesService,
    SpeciesService,
  ],
  exports: [OccurrenceService],
})
export class OccurrenceModule {}
