import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
import { Environment } from 'src/db/bionomics/entities/environment.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { IngestService } from './ingest.service';
import * as bionomics_multiple_rows from './test_data/bionomics_multiple_rows.json';
import * as occurrence_multiple_rows from './test_data/occurrence_multiple_rows.json';
import { Logger } from '@nestjs/common';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { BionomicsService } from 'src/db/bionomics/bionomics.service';
import { Dataset } from 'src/db/shared/entities/dataset.entity';

jest.mock('csvtojson', () => () => ({
  fromString: jest.fn().mockImplementation((csv) => {
    if (csv === 'empty') {
      return [];
    } else if (csv === 'bionomics_single_row') {
      return [bionomics_multiple_rows[0]];
    } else if (csv === 'bionomics_multiple_rows') {
      return bionomics_multiple_rows;
    } else if (csv === 'occurrence_single_row') {
      return [occurrence_multiple_rows[0]];
    } else if (csv === 'occurrence_multiple_rows') {
      return occurrence_multiple_rows;
    }
  }),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('id123'),
}));

jest.mock;

describe('IngestService', () => {
  let service: IngestService;
  let bionomicsRepositoryMock: MockType<Repository<Bionomics>>;
  let referenceRepositoryMock: MockType<Repository<Reference>>;
  let siteRepositoryMock: MockType<Repository<Site>>;
  let datasetRepositoryMock: MockType<Repository<Dataset>>;
  let recordedSpeciesRepositoryMock: MockType<Repository<RecordedSpecies>>;
  let biologyRepositoryMock: MockType<Repository<Biology>>;
  let infectionRepositoryMock: MockType<Repository<Infection>>;
  let bitingRateRepositoryMock: MockType<Repository<BitingRate>>;
  let anthropoZoophagicRepositoryMock: MockType<Repository<AnthropoZoophagic>>;
  let endoExophagicRepositoryMock: MockType<Repository<EndoExophagic>>;
  let environmentRepositoryMock: MockType<Repository<Environment>>;
  let bitingActivityRepositoryMock: MockType<Repository<BitingActivity>>;
  let endoExophilyRepositoryMock: MockType<Repository<EndoExophily>>;
  let sampleRepositoryMock: MockType<Repository<Sample>>;
  let occurrenceRepositoryMock: MockType<Repository<Occurrence>>;
  let logger: MockType<Logger>;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1, 0, 0, 0, 0));
  });
  beforeEach(async () => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestService,
        OccurrenceService,
        BionomicsService,

        {
          provide: getRepositoryToken(Dataset),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Bionomics),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Reference),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Site),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(RecordedSpecies),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Biology),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Infection),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(BitingRate),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Environment),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(AnthropoZoophagic),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(EndoExophagic),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(BitingActivity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(EndoExophily),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Sample),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Occurrence),
          useFactory: repositoryMockFactory,
        },
        {
          provide: Logger,
          useValue: logger,
        },
      ],
      imports: [Bionomics],
    }).compile();

    service = module.get<IngestService>(IngestService);
    datasetRepositoryMock = module.get(getRepositoryToken(Dataset));
    bionomicsRepositoryMock = module.get(getRepositoryToken(Bionomics));
    referenceRepositoryMock = module.get(getRepositoryToken(Reference));
    referenceRepositoryMock.query = jest
      .fn()
      .mockResolvedValue([{ nextval: 1 }]);
    siteRepositoryMock = module.get(getRepositoryToken(Site));
    recordedSpeciesRepositoryMock = module.get(
      getRepositoryToken(RecordedSpecies),
    );
    biologyRepositoryMock = module.get(getRepositoryToken(Biology));
    infectionRepositoryMock = module.get(getRepositoryToken(Infection));
    bitingRateRepositoryMock = module.get(getRepositoryToken(BitingRate));
    environmentRepositoryMock = module.get(getRepositoryToken(Environment));
    anthropoZoophagicRepositoryMock = module.get(
      getRepositoryToken(AnthropoZoophagic),
    );
    endoExophagicRepositoryMock = module.get(getRepositoryToken(EndoExophagic));
    bitingActivityRepositoryMock = module.get(
      getRepositoryToken(BitingActivity),
    );
    endoExophilyRepositoryMock = module.get(getRepositoryToken(EndoExophily));
    sampleRepositoryMock = module.get(getRepositoryToken(Sample));
    occurrenceRepositoryMock = module.get(getRepositoryToken(Occurrence));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveBionomicsCsvToDb', () => {
    it('Bionomics Empty csv, no uploads, no failure', async () => {
      await service.saveBionomicsCsvToDb('empty', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith([]);
    });

    it('Full bionomics, single row, no existing', async () => {
      await service.saveBionomicsCsvToDb('bionomics_single_row', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(bionomics_rows[0])]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(referenceRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(reference_rows[0]),
      );
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(siteRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(site_rows[0]),
      );
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(species_rows[0]),
      );
      expect(biologyRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(biologyRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(biology_rows[0]),
      );
      expect(infectionRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(infectionRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(infection_rows[0]),
      );
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(biting_rate_rows[0]),
      );
      expect(environmentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(environmentRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(environment_rows[0]),
      );
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(anth_zoo_rows[0]),
      );
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(endo_exophagic_rows[0]),
      );
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(biting_activity_rows[0]),
      );
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining(endo_exophily_rows[0]),
      );
    });

    it('Full bionomics, single row, existing', async () => {
      referenceRepositoryMock.findOne = jest.fn().mockResolvedValue({ id: 1 });
      siteRepositoryMock.findOne = jest.fn().mockResolvedValue({ id: 1 });
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({ id: 1 });
      recordedSpeciesRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValue({ id: 1 });

      await service.saveBionomicsCsvToDb('bionomics_single_row', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(bionomics_rows[0])]),
      );
      expect(referenceRepositoryMock.save).not.toHaveBeenCalled();
      expect(siteRepositoryMock.save).not.toHaveBeenCalled();
      expect(biologyRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(biologyRepositoryMock.save).toHaveBeenCalledWith(biology_rows[0]);
      expect(infectionRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(infectionRepositoryMock.save).toHaveBeenCalledWith(
        infection_rows[0],
      );
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledWith(
        biting_rate_rows[0],
      );
      expect(environmentRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(environmentRepositoryMock.save).toHaveBeenCalledWith(
        environment_rows[0],
      );
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledWith(
        anth_zoo_rows[0],
      );
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledWith(
        endo_exophagic_rows[0],
      );
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledWith(
        biting_activity_rows[0],
      );
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledWith(
        endo_exophily_rows[0],
      );
    });

    it('Full bionomics, multiple rows, no existing', async () => {
      await service.saveBionomicsCsvToDb('bionomics_multiple_rows', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(bionomics_rows[0]),
          expect.objectContaining(bionomics_rows[1]),
        ]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(biologyRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(infectionRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(environmentRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledTimes(2);
    });

    it('Full bionomics, multiple rows, existing', async () => {
      referenceRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      siteRepositoryMock.findOne = jest.fn().mockResolvedValueOnce({ id: 1 });
      datasetRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      recordedSpeciesRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });

      await service.saveBionomicsCsvToDb('bionomics_multiple_rows', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(bionomics_rows[0]),
          expect.objectContaining(bionomics_rows[1]),
        ]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(biologyRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(infectionRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(bitingRateRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(environmentRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(anthropoZoophagicRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(endoExophagicRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(bitingActivityRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(endoExophilyRepositoryMock.save).toHaveBeenCalledTimes(2);
    });

    it('Full bionomics, single row, linked occurrence', async () => {
      occurrenceRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });

      await service.saveBionomicsCsvToDb('bionomics_single_row', 'user123');
      expect(bionomicsRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.update).toHaveBeenCalledWith(1, {
        bionomics: expect.objectContaining(bionomics_rows[0]),
      });
    });

    it('Bionomics with db error', async () => {
      bionomicsRepositoryMock.save = jest.fn().mockRejectedValue('DB ERROR');

      await expect(
        service.saveBionomicsCsvToDb('bionomics_single_row', 'user123'),
      ).rejects.toEqual('DB ERROR');

      expect(logger.error).toHaveBeenCalled();
    });

    it('deletes previous data when datasetId is given', async () => {
      bionomicsRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          getMany: jest
            .fn()
            .mockResolvedValue([{ id: 'bion1' }, { id: 'bion2' }]),
        }),
      });
      bionomicsRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({
          biology: { id: 'biology1' },
          environment: { id: 'env1' },
        })
        .mockResolvedValueOnce({
          anthropoZoophagic: { id: 'anth1' },
          environment: { id: 'env2' },
        });

      await service.saveBionomicsCsvToDb(
        'bionomics_single_row',
        'user123',
        'id123',
      );

      expect(bionomicsRepositoryMock.delete).toHaveBeenCalledTimes(2);
      expect(biologyRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(environmentRepositoryMock.delete).toHaveBeenCalledTimes(2);
      expect(anthropoZoophagicRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(bitingRateRepositoryMock.delete).toHaveBeenCalledTimes(0);
    });
  });

  describe('saveOccurrenceCsvToDb', () => {
    it('Occurrence Empty csv, no uploads, no failure', async () => {
      await service.saveOccurrenceCsvToDb('empty', 'user123');
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledWith([]);
    });

    it('Full occurrence, single row, no existing', async () => {
      await service.saveOccurrenceCsvToDb('occurrence_single_row', 'user123');

      expect(occurrenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(occurrence_rows[0])]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(referenceRepositoryMock.save).toHaveBeenCalledWith(
        reference_rows[1],
      );
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(siteRepositoryMock.save).toHaveBeenCalledWith(site_rows[1]);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledWith(
        species_rows[1],
      );
      expect(sampleRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(sampleRepositoryMock.save).toHaveBeenCalledWith(sample_rows[0]);
    });

    it('Full occurrence, single row, existing', async () => {
      referenceRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      siteRepositoryMock.findOne = jest.fn().mockResolvedValueOnce({ id: 1 });
      datasetRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      recordedSpeciesRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });

      await service.saveOccurrenceCsvToDb('occurrence_single_row', 'user123');

      expect(occurrenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(occurrence_rows[0])]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(sampleRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(sampleRepositoryMock.save).toHaveBeenCalledWith(sample_rows[0]);
    });

    it('Full occurrence, multiple rows no existing', async () => {
      await service.saveOccurrenceCsvToDb(
        'occurrence_multiple_rows',
        'user123',
      );
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(occurrence_rows[0]),
          expect.objectContaining(occurrence_rows[1]),
        ]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(sampleRepositoryMock.save).toHaveBeenCalledTimes(2);
    });

    it('Full occurrence, multiple rows, existing', async () => {
      referenceRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      siteRepositoryMock.findOne = jest.fn().mockResolvedValueOnce({ id: 1 });
      datasetRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });
      recordedSpeciesRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });

      await service.saveOccurrenceCsvToDb(
        'occurrence_multiple_rows',
        'user123',
      );
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining(occurrence_rows[0]),
          expect.objectContaining(occurrence_rows[1]),
        ]),
      );
      expect(referenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(siteRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(recordedSpeciesRepositoryMock.save).toHaveBeenCalledTimes(2);
      expect(sampleRepositoryMock.save).toHaveBeenCalledTimes(2);
    });

    it('Full occurrence, single row, linked bionomics', async () => {
      bionomicsRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 });

      await service.saveOccurrenceCsvToDb('occurrence_single_row', 'user123');
      expect(occurrenceRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(occurrenceRepositoryMock.update).toHaveBeenCalledWith('id123', {
        bionomics: { id: 1 },
      });
    });

    it('deletes previous data when datasetId is given', async () => {
      occurrenceRepositoryMock.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          getMany: jest
            .fn()
            .mockResolvedValue([{ id: 'occ1' }, { id: 'occ2' }]),
        }),
      });
      occurrenceRepositoryMock.findOne = jest
        .fn()
        .mockResolvedValueOnce({ sample: { id: 'sample1' } })
        .mockResolvedValueOnce({});

      await service.saveOccurrenceCsvToDb(
        'occurrence_single_row',
        'user123',
        'id123',
      );

      expect(occurrenceRepositoryMock.delete).toHaveBeenCalledTimes(2);
      expect(sampleRepositoryMock.delete).toHaveBeenCalledTimes(1);
    });

    it('Occurrence with db error', async () => {
      occurrenceRepositoryMock.save = jest.fn().mockRejectedValue('DB ERROR');

      await expect(
        service.saveOccurrenceCsvToDb('occurrence_multiple_rows', 'user123'),
      ).rejects.toEqual('DB ERROR');
    });
  });

  describe('validUser', () => {
    it('returns true if user is valid', async () => {
      datasetRepositoryMock.findAndCount = jest
        .fn()
        .mockResolvedValue([[{}], 1]);
      expect(await service.validUser('id123', 'user123')).toBe(true);
    });

    it('returns false if user is invalid', async () => {
      datasetRepositoryMock.findAndCount = jest.fn().mockResolvedValue([[]]);
      expect(await service.validUser('id123', 'user123')).toBe(false);
    });
  });

  describe('validDataset', () => {
    it('returns true if dataset is valid', async () => {
      datasetRepositoryMock.findAndCount = jest
        .fn()
        .mockResolvedValue([[{}], 1]);
      expect(await service.validDataset('id123')).toBe(true);
    });

    it('returns false if dataset is invalid', async () => {
      datasetRepositoryMock.findAndCount = jest.fn().mockResolvedValue([[]]);
      expect(await service.validDataset('id123')).toBe(false);
    });
  });

  describe('doiExists', () => {
    it('returns true if doi exists', async () => {
      datasetRepositoryMock.findAndCount = jest
        .fn()
        .mockResolvedValue([[{}], 1]);
      expect(await service.doiExists('id123', 'dataset_1')).toBe(true);
    });

    it('returns false if dataset is invalid', async () => {
      datasetRepositoryMock.findAndCount = jest.fn().mockResolvedValue([[]]);
      expect(await service.doiExists('id123', 'dataset_1')).toBe(false);
    });
  });
});

const bionomics_rows = [
  {
    id: 'id123',
    adult_data: 'TRUE',
    larval_site_data: 'FALSE',
    contact_authors: 'TRUE',
    contact_notes: '10',
    insecticide_control: 'FALSE',
    control: 'FALSE',
    control_notes: '25',
    month_start: '26',
    month_end: '27',
    year_start: '28',
    year_end: '29',
    season_given: '30',
    season_calc: '31',
    season_notes: '32',
    data_abstracted_by: '159',
    data_checked_by: '160',
    dataset: {
      status: 'Uploaded',
      UpdatedBy: 'user123',
      UpdatedAt: new Date(2020, 3, 1, 0, 0, 0, 0),
      id: 'id123',
    },
  },

  {
    id: 'id123',
    adult_data: 'FALSE',
    larval_site_data: 'TRUE',
    contact_authors: 'FALSE',
    contact_notes: '210',
    insecticide_control: 'TRUE',
    control: 'TRUE',
    control_notes: '225',
    month_start: '226',
    month_end: '227',
    year_start: '228',
    year_end: '229',
    season_given: '230',
    season_calc: '231',
    season_notes: '232',
    data_abstracted_by: '359',
    data_checked_by: '360',
  },
];

const reference_rows = [
  {
    id: 'id123',
    author: '3',
    article_title: '4',
    journal_title: '5',
    year: '6',
    citation: 'Author: 3, Year: 6',
    num_id: 1,
  },
  {
    id: 'id123',
    author: '2',
    year: '3',
    report_type: '4',
    published: 'TRUE',
    v_data: 'FALSE',
    citation: 'Author: 2, Year: 3',
    num_id: 1,
  },
];

const site_rows = [
  {
    id: 'id123',
    country: '12',
    name: '13',
    site_notes: '14',
    location: { type: 'Point', coordinates: [17, 16] },
    area_type: '18',
    georef_source: '19',
    gaul_code: '20',
    admin_level: '21',
    georef_notes: '22',
    latitude: '16',
    longitude: '17',
  },
  {
    id: 'id123',
    country: '7',
    name: '8',
    admin_1: '9',
    admin_2: '10',
    latitude: '13',
    longitude: '14',
    location: { type: 'Point', coordinates: [14, 13] },
    latitude_2: '15',
    longitude_2: '16',
    location_2: { type: 'Point', coordinates: [16, 15] },
    latlong_source: '17',
    good_guess: 'TRUE',
    bad_guess: 'FALSE',
    rural_urban: 'TRUE',
    is_forest: 'FALSE',
    is_rice: 'TRUE',
    area_type: '21',
    site_notes: '20',
  },
];

const species_rows = [
  {
    id: 'id123',
    species: '33',
    species_notes: '35',
    assi: 'TRUE',
    id_method_1: '36',
    id_method_2: '37',
  },
  {
    id: 'id123',
    species: '33',
    ss_sl: '30',
    assi: '31',
    assi_notes: '32',
    id_method_1: '44',
    id_method_2: '45',
  },
];

const biology_rows = [
  {
    sampling_1: '38',
    sampling_2: '39',
    sampling_3: '40',
    sampling_n: '41',
    parity_n: '42',
    parity_total: '43',
    parity_perc: '44',
    daily_survival_rate: '45',
    fecundity: '46',
    gonotrophic_cycle_days: '47',
    notes: '48',
    id: 'id123',
  },
];

const infection_rows = [
  {
    sampling_1: undefined,
    sampling_2: '49',
    sampling_3: '50',
    sampling_n: '51',
    ir_by_csp_n_pool: '52',
    ir_by_csp_total_pool: '53',
    no_per_pool: '54',
    ir_by_csp_perc: '55',
    sr_by_dissection_n: '56',
    sr_by_dissection_total: '57',
    sr_by_dissection_perc: '58',
    sr_by_csp_n: '59',
    sr_by_csp_total: '60',
    sr_by_csp_perc: '61',
    sr_by_pf_n: '62',
    sr_by_pf_total: '63',
    sr_by_p_falciparum: '64',
    sr_by_p_vivax: undefined,
    sr_by_pv_n: undefined,
    sr_by_pv_total: undefined,
    oocyst_n: '65',
    oocyst_total: '66',
    oocyst_rate: '67',
    eir: '68',
    eir_period: '69',
    eir_days: '70',
    notes: '71',
    id: 'id123',
  },
];

const biting_rate_rows = [
  {
    hbr_sampling_indoor: '72',
    indoor_hbr: '73',
    hbr_sampling_outdoor: '74',
    outdoor_hbr: '75',
    hbr_sampling_combined_1: '76',
    hbr_sampling_combined_2: '77',
    hbr_sampling_combined_3: '78',
    hbr_sampling_combined_n: '79',
    combined_hbr: '80',
    hbr_unit: '81',
    abr_sampling_combined_1: '82',
    abr_sampling_combined_2: '83',
    abr_sampling_combined_3: '84',
    abr_sampling_combined_n: '85',
    abr: '86',
    abr_unit: '87',
    notes: '88',
    id: 'id123',
  },
];

const anth_zoo_rows = [
  {
    host_sampling_indoor: '89',
    indoor_host_n: '90',
    indoor_host_total: '91',
    indoor_host_perc: '92',
    host_sampling_outdoor: '93',
    outdoor_host_n: '94',
    outdoor_host_total: '95',
    outdoor_host_perc: '96',
    host_sampling_combined_1: '97',
    host_sampling_combined_2: '98',
    host_sampling_combined_3: '99',
    host_sampling_combined_n: '100',
    combined_host_n: '101',
    combined_host_total: '102',
    combined_host: '103',
    host_unit: '104',
    host_sampling_other_1: '105',
    host_sampling_other_2: '106',
    host_sampling_other_3: '107',
    host_sampling_other_n: '108',
    other_host_n: '109',
    other_host_total: '110',
    host_other: '111',
    host_other_unit: '112',
    notes: '113',
    id: 'id123',
  },
];

const endo_exophagic_rows = [
  {
    sampling_nights_no_indoor: '114',
    biting_sampling_indoor: '115',
    indoor_biting_n: '116',
    indoor_biting_total: '117',
    indoor_biting_data: '118',
    sampling_nights_no_outdoor: '119',
    biting_sampling_outdoor: '120',
    outdoor_biting_n: '121',
    outdoor_biting_total: '122',
    outdoor_biting_data: '123',
    biting_unit: '124',
    notes: '125',
    id: 'id123',
  },
];

const biting_activity_rows = [
  {
    sampling_nights_no_indoor: '126',
    '18_30_21_30_indoor': '127',
    '21_30_00_30_indoor': '128',
    '00_30_03_30_indoor': '129',
    '03_30_06_30_indoor': '130',
    sampling_nights_no_outdoor: '131',
    '18_30_21_30_outdoor': '132',
    '21_30_00_30_outdoor': '133',
    '00_30_03_30_outdoor': '134',
    '03_30_06_30_outdoor': '135',
    sampling_nights_no_combined: '136',
    '18_30_21_30_combined': '137',
    '21_30_00_30_combined': '138',
    '00_30_03_30_combined': '139',
    '03_30_06_30_combined': '140',
    notes: '141',
    id: 'id123',
  },
];

const endo_exophily_rows = [
  {
    resting_sampling_indoor: '142',
    unfed_indoor: '143',
    fed_indoor: '144',
    gravid_indoor: '145',
    total_indoor: '146',
    resting_sampling_outdoor: '147',
    unfed_outdoor: '148',
    fed_outdoor: '149',
    gravid_outdoor: '150',
    total_outdoor: '151',
    resting_sampling_other: '152',
    unfed_other: '153',
    fed_other: '154',
    gravid_other: '155',
    total_other: '156',
    resting_unit: '157',
    notes: '158',
    id: 'id123',
  },
];

const occurrence_rows = [
  {
    id: 'id123',
    month_start: '25',
    year_start: '27',
    month_end: '26',
    year_end: '28',
    dec_id: '50',
    dec_check: '51',
    map_check: '52',
    vector_notes: '53',
    download_count: 0,
  },
  {
    id: 'id123',
    month_start: '225',
    year_start: '227',
    month_end: '226',
    year_end: '228',
    dec_id: '250',
    dec_check: '251',
    map_check: '252',
    vector_notes: '253',
    download_count: 0,
  },
];

const sample_rows = [
  {
    id: 'id123',
    mossamp_tech_1: '34',
    n_1: '35',
    mossamp_tech_2: '36',
    n_2: '37',
    mossamp_tech_3: '38',
    n_3: '39',
    mossamp_tech_4: '40',
    n_4: '41',
    n_all: '42',
    control: 'TRUE',
    control_type: '49',
  },
];

const environment_rows = [
  {
    id: 'id123',
    roof: '37.06',
    walls: '37.12',
    house_screening: 'FALSE',
    open_eaves: 'TRUE',
    cooking: '37.30',
    housing_notes: '37.36',
    occupation_1: '37.42',
    outdoor_activities_night: 'TRUE',
    sleeping_outdoors: 'FALSE',
    community_notes: '37.60',
    farming: '37.66',
    farming_notes: '37.72',
    livestock_1: '37.78',
    livestock_notes: '37.84',
    local_plants: '37.92',
  },
];
