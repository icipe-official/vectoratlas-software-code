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
import { ReferenceService } from './db/shared/reference.service';
import { Reference } from './db/shared/entities/reference.entity';
import { SpeciesInformationService } from './db/speciesInformation/speciesInformation.service';
import { SpeciesInformationResolver } from './db/speciesInformation/speciesInformation.resolver';
import { SpeciesInformation } from './db/speciesInformation/entities/speciesInformation.entity';
import { NewsService } from './db/news/news.service';
import { News } from './db/news/entities/news.entity';
import { ValidationService } from './validation/validation.service';
import { ModelsTransformationService } from './models/modelsTransformation.service';
import { Logger } from '@nestjs/common';
import { AnalyticsService } from './analytics/analytics.service';
import { HttpService } from '@nestjs/axios';

export const buildTestingModule = async () => {
  const logger = {
    log: jest.fn(),
    error: jest.fn(),
  };

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
      ReferenceService,
      {
        provide: getRepositoryToken(Reference),
        useFactory: repositoryMockFactory,
      },
      SpeciesInformationService,
      SpeciesInformationResolver,
      {
        provide: getRepositoryToken(SpeciesInformation),
        useFactory: repositoryMockFactory,
      },
      NewsService,
      {
        provide: getRepositoryToken(News),
        useFactory: repositoryMockFactory,
      },
      ValidationService,
      ModelsTransformationService,
      AnalyticsService,
      {
        provide: Logger,
        useValue: logger,
      },
      {
        provide: HttpService,
        useValue: {
          post: jest.fn().mockReturnThis(),
          get: jest.fn().mockReturnThis(),
          pipe: jest.fn(),
        },
      },
    ],
    imports: [
      Sample,
      Occurrence,
      Site,
      Bionomics,
      RecordedSpecies,
      SpeciesInformation,
    ],
  }).compile();

  return module;
};
