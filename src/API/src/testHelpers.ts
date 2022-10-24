import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/mocks';
import { SampleService } from './db/occurrence/sample.service';
import { Sample } from './db/occurrence/entities/sample.entity';
import { OccurrenceService } from './db/occurrence/occurrence.service';
import { Occurrence } from './db/occurrence/entities/occurrence.entity';
import { SiteService } from './db/shared/site.service';
import { Site } from './db/shared/entities/site.entity';
import { BionomicsService } from './db/bionomics/bionomics.service';
import { Bionomics } from './db/bionomics/entities/bionomics.entity';
import { UserRoleService } from './auth/user_role/user_role.service';
import { UserRole } from './auth/user_role/user_role.entity';
import { OccurrenceResolver } from './db/occurrence/occurrence.resolver';
import { RecordedSpecies } from './db/shared/entities/recorded_species.entity';
import { RecordedSpeciesService } from './db/shared/recordedSpecies.service';
import { RecordedSpeciesResolver } from './db/shared/recordedSpecies.resolver';
import { SpeciesService } from './db/shared/species.service';
import { Species } from './db/shared/entities/species.entity';

export const buildTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      RecordedSpeciesService,
      {
        provide: getRepositoryToken(RecordedSpecies),
        useFactory: repositoryMockFactory,
      },
      SampleService,
      {
        provide: getRepositoryToken(Sample),
        useFactory: repositoryMockFactory,
      },
      OccurrenceService,
      {
        provide: getRepositoryToken(Occurrence),
        useFactory: repositoryMockFactory,
      },
      SiteService,
      {
        provide: getRepositoryToken(Site),
        useFactory: repositoryMockFactory,
      },
      SpeciesService,
      {
        provide: getRepositoryToken(Species),
        useFactory: repositoryMockFactory,
      },
      BionomicsService,
      {
        provide: getRepositoryToken(Bionomics),
        useFactory: repositoryMockFactory,
      },
      UserRoleService,
      {
        provide: getRepositoryToken(UserRole),
        useFactory: repositoryMockFactory,
      },
      OccurrenceResolver,
      RecordedSpeciesResolver,
    ],
    imports: [Sample, Occurrence, Site, Bionomics, RecordedSpecies],
  }).compile();

  return module;
};
