import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthropoZoophagic } from 'src/db/bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from 'src/db/bionomics/entities/biology.entity';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { BitingActivity } from 'src/db/bionomics/entities/biting_activity.entity';
import { BitingRate } from 'src/db/bionomics/entities/biting_rate.entity';
import { EndoExophagic } from 'src/db/bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from 'src/db/bionomics/entities/endo_exophily.entity';
import { Infection } from 'src/db/bionomics/entities/infection.entity';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { Sample } from 'src/db/occurrence/entities/sample.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { RecordedSpecies } from 'src/db/shared/entities/recorded_species.entity';
import { ExportController } from './export.controller';
import { IngestService } from '../ingest//ingest.service';
import { Species } from 'src/db/shared/entities/species.entity';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { BionomicsService } from 'src/db/bionomics/bionomics.service';
import { AllDataFileBuilder } from './utils/lastIngestWatch';
import { ExportService } from './export.service';

@Module({
  controllers: [ExportController],
  providers: [
    IngestService,
    OccurrenceService,
    BionomicsService,
    Logger,
    AllDataFileBuilder,
    ExportService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Bionomics,
      Reference,
      Site,
      RecordedSpecies,
      Species,
      Biology,
      Infection,
      BitingRate,
      AnthropoZoophagic,
      EndoExophagic,
      BitingActivity,
      EndoExophily,
      Sample,
      Occurrence,
    ]),
  ],
})
export class ExportModule {}
