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

export const buildTestingModule = async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
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
    ],
    imports: [Sample, Occurrence, Site, Bionomics],
  }).compile();

  return module;
};
