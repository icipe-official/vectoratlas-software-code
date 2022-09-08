import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { assert } from 'console';
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
import { Species } from 'src/db/shared/entities/species.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { IngestService } from './ingest.service';
import * as bionomics_single_row from './test_data/bionomics_single_row.json';

jest.mock('csvtojson', () => () => ({
  fromString: jest.fn().mockImplementation((csv) => {
    if (csv === "empty") {
      return [];
    } else if (csv === "single_row") {
      return bionomics_single_row;
    }
  })
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123')
}))

/* Test cases

1. Empty csv, no uploads, no failure - done
2. Full bionomics, single row, no existing
3. Full bionomics, single row, existing
4. Full bionomics, multiple rows, no existing, no overlap
5. Full bionomics, multiple rows, no existing, overlap
6. Full bionomics, multiple rows, existing
7. Bionomics with missing essential info
8. Bionomics with incorrect data types
Repeat 2-8 for occurrence

 */

describe('IngestService', () => {
  let service: IngestService;
  let bionomicsRepositoryMock: MockType<Repository<Bionomics>>;
  let referenceRepositoryMock: MockType<Repository<Reference>>;
  let siteRepositoryMock: MockType<Repository<Site>>;
  let speciesRepositoryMock: MockType<Repository<Species>>;
  let biologyRepositoryMock: MockType<Repository<Biology>>;
  let infectionRepositoryMock: MockType<Repository<Infection>>;
  let bitingRateRepositoryMock: MockType<Repository<BitingRate>>;
  let anthropoZoophagicRepositoryMock: MockType<Repository<AnthropoZoophagic>>;
  let endoExophagicRepositoryMock: MockType<Repository<EndoExophagic>>;
  let bitingActivityRepositoryMock: MockType<Repository<BitingActivity>>;
  let endoExophilyRepositoryMock: MockType<Repository<EndoExophily>>;
  let sampleRepositoryMock: MockType<Repository<Sample>>;
  let occurrenceRepositoryMock: MockType<Repository<Occurrence>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        { provide: getRepositoryToken(Bionomics), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Reference), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Site), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Species), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Biology), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Infection), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BitingRate), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(AnthropoZoophagic), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(EndoExophagic), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(BitingActivity), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(EndoExophily), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Sample), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Occurrence), useFactory: repositoryMockFactory },
      ],
      imports: [
        Bionomics
      ]
    }).compile();

    service = module.get<IngestService>(IngestService);
    bionomicsRepositoryMock = module.get(getRepositoryToken(Bionomics));
    referenceRepositoryMock = module.get(getRepositoryToken(Reference));
    siteRepositoryMock = module.get(getRepositoryToken(Site));
    speciesRepositoryMock = module.get(getRepositoryToken(Species));
    biologyRepositoryMock = module.get(getRepositoryToken(Biology));
    infectionRepositoryMock = module.get(getRepositoryToken(Infection));
    bitingRateRepositoryMock = module.get(getRepositoryToken(BitingRate));
    anthropoZoophagicRepositoryMock = module.get(getRepositoryToken(AnthropoZoophagic));
    endoExophagicRepositoryMock = module.get(getRepositoryToken(EndoExophagic));
    bitingActivityRepositoryMock = module.get(getRepositoryToken(BitingActivity));
    endoExophilyRepositoryMock = module.get(getRepositoryToken(EndoExophily));
    sampleRepositoryMock = module.get(getRepositoryToken(Sample));
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Empty csv, no uploads, no failure', async () => {
    await service.saveBionomicsCsvToDb("empty");
    expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith([]);
  });

  fit('Full bionomics, single row, no existing', async () => {
    await service.saveBionomicsCsvToDb("single_row");
    expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'id123',
          adult_data: 'TRUE',
          larval_site_data: 'FALSE',
          contact_authors: 'TRUE',
          contact_notes: '10',
          secondary_info: '11',
          insecticide_control: 'FALSE',
          control: '24',
          control_notes: '25',
          month_start: '26',
          month_end: '27',
          year_start: '28',
          year_end: '29',
          season_given: '30',
          season_calc: '31',
          season_notes: '32',
          data_abstracted_by: '159',
          data_checked_by: '160'
        })
      ]));
  });
});
