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
import { BionomicsService } from '../bionomics/bionomics.service';
import { Bionomics } from '../bionomics/entities/bionomics.entity';
import { Reference } from '../shared/entities/reference.entity';
import { ReferenceService } from '../shared/reference.service';
import { DoiModule } from '../doi/doi.module';
import { DoiService } from '../doi/doi.service';
import { HttpModule } from '@nestjs/axios';
import { DOI } from '../doi/entities/doi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Occurrence,
      Site,
      Sample,
      RecordedSpecies,
      Bionomics,
      Reference,
      DOI,
    ]),
    HttpModule,
    DoiModule,
  ],
  providers: [
    OccurrenceService,
    OccurrenceResolver,
    SiteService,
    SampleService,
    RecordedSpeciesService,
    BionomicsService,
    ReferenceService,
    DoiService,
  ],
  exports: [OccurrenceService, SiteService, SampleService, OccurrenceResolver],
})
export class OccurrenceModule {}
