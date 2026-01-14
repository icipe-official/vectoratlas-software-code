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
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { InsecticideResistanceBioassays } from 'src/db/insecticideResistance/entities/insecticideResistanceBioassays.entity';
import { Rdl296GenotypeFrequencies } from 'src/db/insecticideResistance/entities/rdl296GenotypeFrequencies.entity';
import { EditLogsModule } from 'src/db/edit-logs/editLogs.module';
import { OccurrenceModule } from 'src/db/occurrence/occurrence.module';
import { LarvalSite } from 'src/db/bionomics/entities/larval_site.entity';
import { Ace1AlleleFrequencies } from 'src/db/insecticideResistance/entities/ace1AlleleFrequencies.entity';
import { Ace1GenotypeFrequencies } from 'src/db/insecticideResistance/entities/ace1GenotypeFrequencies.entity';
import { Ace1MethodAndSample } from 'src/db/insecticideResistance/entities/ace1MethodAndSample.entity';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { Cyp4j5AlleleFrequencies } from 'src/db/insecticideResistance/entities/cyp4j5AlleleFrequencies.entity';
import { Cyp4j5GenotypeFrequencies } from 'src/db/insecticideResistance/entities/cyp4j5GenotypeFrequencies.entity';
import { Cyp6aapAlleleFrequencies } from 'src/db/insecticideResistance/entities/cyp6aapAlleleFrequencies.entity';
import { Cyp6aapGenotypeFrequencies } from 'src/db/insecticideResistance/entities/cyp6aapGenotypeFrequencies.entity';
import { Cyp6p4AlleleFrequencies } from 'src/db/insecticideResistance/entities/cyp6p4AlleleFrequencies.entity';
import { Cyp6p4GenotypeFrequencies } from 'src/db/insecticideResistance/entities/cyp6p4GenotypeFrequencies.entity';
import { CytochromesP450_cypMethodAndSample } from 'src/db/insecticideResistance/entities/cytochromesP450_cypMethodAndSample.entity';
import { DoiSource } from 'src/db/doi-source/entities/doi-source.entity';
import { GenotypicRepresentativeness } from 'src/db/insecticideResistance/entities/genotypicRepresentativeness.entity';
import { Gste2_114AlleleFrequencies } from 'src/db/insecticideResistance/entities/gste2_114AlleleFrequencies.entity';
import { Gste2_114GenotypeFrequencies } from 'src/db/insecticideResistance/entities/gste2_114GenotypeFrequencies.entity';
import { Gste2_119AlleleFrequencies } from 'src/db/insecticideResistance/entities/gste2_119AlleleFrequencies.entity';
import { Gste2_119GenotypeFrequencies } from 'src/db/insecticideResistance/entities/gste2_119GenotypeFrequencies.entity';
import { GsteMethodAndSample } from 'src/db/insecticideResistance/entities/gsteMethodAndSample.entity';
import { KdrGenotypeFrequencies } from 'src/db/insecticideResistance/entities/kdrGenotypeFrequencies.entity';
import { News } from 'src/db/news/entities/news.entity';
import { Rdl296AlleleFrequencies } from 'src/db/insecticideResistance/entities/rdl296AlleleFrequencies.entity';
import { RdlMethodAndSample } from 'src/db/insecticideResistance/entities/rdlMethodAndSample.entity';
import { SpeciesInformation } from 'src/db/speciesInformation/entities/speciesInformation.entity';
import { UploadedDataset } from 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetLog } from 'src/db/uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { Vgsc1570AlleleFrequencies } from 'src/db/insecticideResistance/entities/vgsc1570AlleleFrequencies.entity';
import { Vgsc1570GenotypeFrequencies } from 'src/db/insecticideResistance/entities/vgsc1570GenotypeFrequencies.entity';
import { Vgsc402AlleleFrequencies } from 'src/db/insecticideResistance/entities/vgsc402AlleleFrequencies.entity';

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
      UserRole,
      InsecticideResistanceBioassays,
      Rdl296GenotypeFrequencies,
      LarvalSite,
      Ace1AlleleFrequencies,
      Ace1GenotypeFrequencies,
      Ace1MethodAndSample,
      CommunicationLog,
      Cyp4j5AlleleFrequencies,
      Cyp4j5GenotypeFrequencies,
      Cyp6aapAlleleFrequencies,
      Cyp6aapGenotypeFrequencies,
      Cyp6p4AlleleFrequencies,
      Cyp6p4GenotypeFrequencies,
      CytochromesP450_cypMethodAndSample,
      DoiSource,
      GenotypicRepresentativeness,
      Gste2_114AlleleFrequencies,
      Gste2_114GenotypeFrequencies,
      Gste2_119AlleleFrequencies,
      Gste2_119GenotypeFrequencies,
      GsteMethodAndSample,
      KdrGenotypeFrequencies,
      News,
      Rdl296AlleleFrequencies,
      RdlMethodAndSample,
      SpeciesInformation,
      UploadedDataset,
      UploadedDatasetLog,
      Vgsc1570AlleleFrequencies,
      Vgsc1570GenotypeFrequencies,
      Vgsc402AlleleFrequencies,
    ]),
    EditLogsModule,
    OccurrenceModule,
  ],
})
export class IngestModule {}
