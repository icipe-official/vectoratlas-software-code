import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger, Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceResolver } from './reference.resolver';
import { Reference } from './entities/reference.entity';
import { DatasetService } from './dataset.service';
import { DatasetResolver } from './dataset.resolver';
import { Dataset } from './entities/dataset.entity';
import { AuthService } from 'src/auth/auth.service';
import { HttpModule } from '@nestjs/axios';
import { DatasetController } from './dataset.controller';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { EmailService } from '../../email/email.service';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { RecordedSpecies } from './entities/recorded_species.entity';
import { RecordedSpeciesService } from './recordedSpecies.service';
import { RecordedSpeciesResolver } from './recordedSpecies.resolver';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Reference, Dataset, RecordedSpecies]),
    TypeOrmModule.forFeature([UserRole, CommunicationLog]),
  ],
  providers: [
    ReferenceService,
    ReferenceResolver,
    DatasetService,
    DatasetResolver,
    AuthService,
    UserRoleService,
    EmailService,
    CommunicationLogService,
    RecordedSpeciesService,
    RecordedSpeciesResolver,
    Logger,
  ],
  exports: [ReferenceService, DatasetService, RecordedSpeciesService],
  controllers: [DatasetController],
})
export class SharedModule {}
