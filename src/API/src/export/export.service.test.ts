import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceService } from '../db/occurrence/occurrence.service';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Logger } from '@nestjs/common';
import { flattenOccurrenceRepoObject } from './utils/allDataCsvCreation';
import { occurrenceMapper } from './utils/occurrenceMapper';
import { ExportService } from './export.service';
import { Occurrence } from '../db/occurrence/entities/occurrence.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as fs from 'fs';

jest.mock('./utils/allDataCsvCreation', () => ({
  flattenOccurrenceRepoObject: jest.fn(),
}));
jest.mock('./utils/occurrenceMapper', () => ({
  occurrenceMapper: jest.fn().mockReturnValue('mapped to csv'),
}));
jest.mock('fs');
jest.spyOn(fs, 'writeFileSync');

describe('Export service', () => {
  let exportService: ExportService;
  let occurrenceService: OccurrenceService;
  let logger: MockType<Logger>;

  beforeEach(async () => {
    logger = {
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        OccurrenceService,
        {
          provide: getRepositoryToken(Occurrence),
          useFactory: repositoryMockFactory,
        },
        {
          provide: Logger,
          useValue: logger,
        },
      ],
    }).compile();

    exportService = module.get<ExportService>(ExportService);
    occurrenceService = module.get<OccurrenceService>(OccurrenceService);
  });
  describe('exportOccurrenceDbtoCsvFormat function', () => {
    it('delegates to findAll() from occurrence service prior to flattening', async () => {
      const findAllMock = 'all occurrences';
      occurrenceService.findAll = jest.fn().mockResolvedValue(findAllMock);
      await exportService.exportOccurrenceDbtoCsvFormat();
      expect(occurrenceService.findAll()).toHaveBeenCalled;
      expect(flattenOccurrenceRepoObject).toBeCalledWith(findAllMock);
    });
  });
  describe('exportCsvToDownloadsFile function', () => {
    it('calls on occurrenceMapper prior to file write', async () => {
      const mockCsv = { data: 'mock csv data' };
      await exportService.exportCsvToDownloadsFile(mockCsv, 'occurrence');
      expect(occurrenceMapper).toHaveBeenCalled;
      expect(occurrenceMapper).toBeCalledWith(mockCsv);
      expect(occurrenceMapper).toReturnWith('mapped to csv');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        `${process.cwd()}/public/downloads/occurrenceDownloadFile.csv`,
        'mapped to csv',
      );
    });
  });
});
