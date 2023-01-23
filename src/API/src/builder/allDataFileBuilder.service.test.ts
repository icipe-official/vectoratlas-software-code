import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/mocks';
import { Logger } from '@nestjs/common';
import { ExportService } from '../export/export.service';
import { AllDataFileBuilder } from './allDataFileBuilder.service';
import { handleLastIngestLock } from '../ingest/utils/triggerCsvRebuild';
import * as fs from 'fs';

jest.mock('fs');
jest.mock('../ingest/utils/triggerCsvRebuild', () => ({
  handleLastIngestLock: jest.fn().mockReturnValue('mapped to csv'),
}));

describe('allDataFileBuilder service', () => {
  let allDataFileBuilder: AllDataFileBuilder;
  let exportService: MockType<ExportService>;
  let logger: MockType<Logger>;

  beforeEach(async () => {
    jest.clearAllMocks();
    logger = {
      error: jest.fn(),
    };
    exportService = {
      exportOccurrenceDbtoCsvFormat: jest.fn(),
      exportCsvToDownloadsFile: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllDataFileBuilder,
        {
          provide: Logger,
          useValue: logger,
        },
        {
          provide: ExportService,
          useValue: exportService,
        },
      ],
    }).compile();

    allDataFileBuilder = module.get<AllDataFileBuilder>(AllDataFileBuilder);
  });
  describe('lastIngestWatch', () => {
    it('calls csv update if last ingest and current ingest times differ', async () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(
          JSON.stringify({ ingestion: { ingestTime: '1', isLocked: 'false' } }),
        )
        .mockReturnValueOnce(
          JSON.stringify({ ingestion: { ingestTime: '2', isLocked: 'false' } }),
        );
      allDataFileBuilder.initialiseBuilder();
      await allDataFileBuilder.lastIngestWatch();
      expect(exportService.exportOccurrenceDbtoCsvFormat).toBeCalled();
      expect(exportService.exportCsvToDownloadsFile).toBeCalled();
      expect(handleLastIngestLock).toBeCalledWith(false);
    });

    it('does not call csv update if last ingest and current ingest times are the same', async () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(
          JSON.stringify({ ingestion: { ingestTime: '1', isLocked: 'false' } }),
        )
        .mockReturnValueOnce(
          JSON.stringify({ ingestion: { ingestTime: '1', isLocked: 'false' } }),
        );
      allDataFileBuilder.initialiseBuilder();
      await allDataFileBuilder.lastIngestWatch();
      expect(exportService.exportOccurrenceDbtoCsvFormat).not.toBeCalled();
    });
  });
});
