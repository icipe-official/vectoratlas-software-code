import { Test, TestingModule } from '@nestjs/testing';
import { OccurrenceService } from 'src/db/occurrence/occurrence.service';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Logger } from '@nestjs/common';
import { ExportService } from './export/export.service';
import { AllDataFileBuilder } from './allDataFileBuilder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Occurrence } from 'src/db/occurrence/entities/occurrence.entity';
import { handleLastIngestLock } from 'src/ingest/utils/triggerCsvRebuild';
import * as fs from 'fs';

jest
  .spyOn(fs, 'readFileSync')
  .mockReturnValueOnce(
    JSON.stringify({ ingestion: { ingestTime: '1', isLocked: 'false' } }),
  );
jest.mock('src/ingest/utils/triggerCsvRebuild', () => ({
  handleLastIngestLock: jest.fn().mockReturnValue('mapped to csv'),
}));

describe('allDataFileBuilder service', () => {
  let allDataFileBuilder: AllDataFileBuilder;
  let exportService: ExportService;
  let logger: MockType<Logger>;

  beforeEach(async () => {
    logger = {
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        OccurrenceService,
        AllDataFileBuilder,
        {
          provide: Logger,
          useValue: logger,
        },
        {
          provide: getRepositoryToken(Occurrence),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    allDataFileBuilder = module.get<AllDataFileBuilder>(AllDataFileBuilder);
    exportService = module.get<ExportService>(ExportService);
  });
  describe('exportAllDataToCsvFile', () => {
    it('delegates to exportOccurrenceDbtoCsvFormat() from the occurrence service', async () => {
      exportService.exportOccurrenceDbtoCsvFormat = jest.fn();
      await allDataFileBuilder.exportAllDataToCsvFile();
      expect(exportService.exportOccurrenceDbtoCsvFormat).toBeCalled();
    });
  });
  describe('lastIngestWatch', () => {
    it('calls csv update if last ingest and current ingest times differ', async () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
        JSON.stringify({
          ingestion: { ingestTime: '2', isLocked: 'false' },
        }),
      );
      exportService.exportCsvToDownloadsFile = jest.fn();
      exportService.exportOccurrenceDbtoCsvFormat = jest.fn();
      await allDataFileBuilder.lastIngestWatch();
      expect(exportService.exportOccurrenceDbtoCsvFormat).toBeCalled();
      expect(exportService.exportCsvToDownloadsFile).toBeCalled();
      expect(handleLastIngestLock).toBeCalledWith(false);
    });
    it('does not call csv update if last ingest and current ingest times are the same', async () => {
      exportService.exportCsvToDownloadsFile = jest.fn();
      exportService.exportOccurrenceDbtoCsvFormat = jest.fn();
      await allDataFileBuilder.lastIngestWatch();
      expect(exportService.exportOccurrenceDbtoCsvFormat).not.toBeCalled();
    });
  });
});
