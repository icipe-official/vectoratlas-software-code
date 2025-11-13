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
import { OccurrenceController } from './occurrence.controller';
import { Dataset } from '../shared/entities/dataset.entity';
import { InsecticideResistanceBioassays } from '../insecticideResistance/entities/insecticideResistanceBioassays.entity';
import { InsecticideResistanceService } from '../insecticideResistance/insecticideResistance.service';
import { InsecticideResistanceModule } from '../insecticideResistance/insecticideResistance.module';
import { EditLog } from '../edit-logs/editLog.entity';
import { EditLogsModule } from '../edit-logs/editLogs.module';

import { LarvalSite } from '../bionomics/entities/larval_site.entity';
import { Ace1AlleleFrequencies } from '../insecticideResistance/entities/ace1AlleleFrequencies.entity';
import { Ace1GenotypeFrequencies } from '../insecticideResistance/entities/ace1GenotypeFrequencies.entity';
import { Ace1MethodAndSample } from '../insecticideResistance/entities/ace1MethodAndSample.entity';
import { AnthropoZoophagic } from '../bionomics/entities/anthropo_zoophagic.entity';
import { Biology } from '../bionomics/entities/biology.entity';
import { BitingActivity } from '../bionomics/entities/biting_activity.entity';
import { BitingRate } from '../bionomics/entities/biting_rate.entity';
import { Cyp4j5AlleleFrequencies } from '../insecticideResistance/entities/cyp4j5AlleleFrequencies.entity';
import { Cyp4j5GenotypeFrequencies } from '../insecticideResistance/entities/cyp4j5GenotypeFrequencies.entity';
import { Cyp6aapAlleleFrequencies } from '../insecticideResistance/entities/cyp6aapAlleleFrequencies.entity';
import { Cyp6aapGenotypeFrequencies } from '../insecticideResistance/entities/cyp6aapGenotypeFrequencies.entity';
import { Cyp6p4AlleleFrequencies } from '../insecticideResistance/entities/cyp6p4AlleleFrequencies.entity';
import { Cyp6p4GenotypeFrequencies } from '../insecticideResistance/entities/cyp6p4GenotypeFrequencies.entity';
import { CytochromesP450_cypMethodAndSample } from '../insecticideResistance/entities/cytochromesP450_cypMethodAndSample.entity';
import { EndoExophagic } from '../bionomics/entities/endo_exophagic.entity';
import { EndoExophily } from '../bionomics/entities/endo_exophily.entity';
import { Environment } from '../bionomics/entities/environment.entity';
import { GenotypicRepresentativeness } from '../insecticideResistance/entities/genotypicRepresentativeness.entity';
import { Gste2_114AlleleFrequencies } from '../insecticideResistance/entities/gste2_114AlleleFrequencies.entity';
import { Gste2_114GenotypeFrequencies } from '../insecticideResistance/entities/gste2_114GenotypeFrequencies.entity';
import { Gste2_119AlleleFrequencies } from '../insecticideResistance/entities/gste2_119AlleleFrequencies.entity';
import { Gste2_119GenotypeFrequencies } from '../insecticideResistance/entities/gste2_119GenotypeFrequencies.entity';
import { GsteMethodAndSample } from '../insecticideResistance/entities/gsteMethodAndSample.entity';
import { Infection } from '../bionomics/entities/infection.entity';
import { KdrGenotypeFrequencies } from '../insecticideResistance/entities/kdrGenotypeFrequencies.entity';
import { Rdl296AlleleFrequencies } from '../insecticideResistance/entities/rdl296AlleleFrequencies.entity';
import { Rdl296GenotypeFrequencies } from '../insecticideResistance/entities/rdl296GenotypeFrequencies.entity';
import { RdlMethodAndSample } from '../insecticideResistance/entities/rdlMethodAndSample.entity';
import { SpeciesInformation } from '../speciesInformation/entities/speciesInformation.entity';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { Vgsc1570AlleleFrequencies } from '../insecticideResistance/entities/vgsc1570AlleleFrequencies.entity';
import { Vgsc1570GenotypeFrequencies } from '../insecticideResistance/entities/vgsc1570GenotypeFrequencies.entity';
import { Vgsc402AlleleFrequencies } from '../insecticideResistance/entities/vgsc402AlleleFrequencies.entity';
import { DoiSource } from '../doi-source/entities/doi-source.entity';
import { News } from '../news/entities/news.entity';

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
      LarvalSite,
      Ace1AlleleFrequencies,
      Ace1GenotypeFrequencies,
      Ace1MethodAndSample,
      AnthropoZoophagic,
      Biology,
      Bionomics,
      BitingActivity,
      BitingRate,
      Cyp4j5AlleleFrequencies,
      Cyp4j5GenotypeFrequencies,
      Cyp6aapAlleleFrequencies,
      Cyp6aapGenotypeFrequencies,
      Cyp6p4AlleleFrequencies,
      Cyp6p4GenotypeFrequencies,
      CytochromesP450_cypMethodAndSample,
      Dataset,
      EndoExophagic,
      EndoExophily,
      Environment,
      GenotypicRepresentativeness,
      Gste2_114AlleleFrequencies,
      Gste2_114GenotypeFrequencies,
      Gste2_119AlleleFrequencies,
      Gste2_119GenotypeFrequencies,
      GsteMethodAndSample,
      Infection,
      InsecticideResistanceBioassays,
      KdrGenotypeFrequencies,
      Occurrence,
      Rdl296AlleleFrequencies,
      Rdl296GenotypeFrequencies,
      RdlMethodAndSample,
      RecordedSpecies,
      Reference,
      Sample,
      Site,
      SpeciesInformation,
      UploadedDataset,
      UploadedDatasetLog,
      UserRole,
      Vgsc1570AlleleFrequencies,
      Vgsc1570GenotypeFrequencies,
      Vgsc402AlleleFrequencies,
      CommunicationLog,
      DoiSource,
      News,
    ]),
    InsecticideResistanceModule,
    EditLogsModule,
  ],
  controllers: [OccurrenceController],
  providers: [
    OccurrenceService,
    OccurrenceResolver,
    SiteService,
    SampleService,
    RecordedSpeciesService,
    BionomicsService,
    ReferenceService,
    Logger,
    AuthService,
    UserRoleService,
    CommunicationLogService,
    // UploadedDatasetService,
  ],
  exports: [OccurrenceService, SiteService, SampleService, OccurrenceResolver],
})
export class OccurrenceModule {}
