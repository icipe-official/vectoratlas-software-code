import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Logger, Module } from '@nestjs/common';
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
import { DoiService } from '../doi/doi.service';
import { HttpModule } from '@nestjs/axios';
import { DOI } from '../doi/entities/doi.entity';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { EmailModule } from '../../email/email.module';
import { EmailService } from '../../email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UploadedDatasetService } from '../uploaded-dataset/uploaded-dataset.service';
import { DoiModule } from '../doi/doi.module';
import { AuthService } from 'src/auth/auth.service';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';

@Module({
  imports: [
    EmailModule,
    HttpModule,
    forwardRef(() => DoiModule),
    TypeOrmModule.forFeature([
      Occurrence,
      Site,
      Sample,
      RecordedSpecies,
      Bionomics,
      Reference,
      DOI,
      UserRole,
    ]),
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
    Logger,
    AuthService,
    UserRoleService
    // UploadedDatasetService,
  ],
  exports: [OccurrenceService, SiteService, SampleService, OccurrenceResolver],
})
export class OccurrenceModule {}
