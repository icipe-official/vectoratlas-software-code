import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnthropoZoophagic } from '../db/bionomics/entities/anthropo_zoophagic.entity';
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
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { BionomicsService } from 'src/db/bionomics/bionomics.service';
import { Environment } from 'src/db/bionomics/entities/environment.entity';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { ValidationService } from 'src/validation/validation.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [IngestController],
  providers: [
    IngestService,
    OccurrenceService,
    BionomicsService,
    Logger,
    ValidationService,
  ],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Bionomics,
      Reference,
      Site,
      Dataset,
      RecordedSpecies,
      Environment,
      Biology,
      Infection,
      BitingRate,
      AnthropoZoophagic,
      EndoExophagic,
      BitingActivity,
      EndoExophily,
      Sample,
      Occurrence,
      UserRole
    ]),
  ],
})
export class IngestModule {}
