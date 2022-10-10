import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/mocks';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

describe('IngestController', () => {
  let controller: IngestController;
  let ingestService: MockType<IngestService>;

  beforeEach(async () => {
    ingestService = {
      saveBionomicsCsvToDb: jest.fn(),
      saveOccurrenceCsvToDb: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        {
          provide: IngestService,
          useValue: ingestService,
        },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should delegate to the ingest service to save bionomics data', async () => {
    const bionomicsCsv = {
      buffer: Buffer.from('Test bionomics'),
    } as Express.Multer.File;

    await controller.uploadBionomicsCsv(bionomicsCsv);

    expect(ingestService.saveBionomicsCsvToDb).toHaveBeenCalledWith(
      'Test bionomics',
    );
  });

  it('should delegate to the ingest service to save occurrence data', async () => {
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    await controller.uploadOccurrenceCsv(occurrencesCsv);

    expect(ingestService.saveOccurrenceCsvToDb).toHaveBeenCalledWith(
      'Test occurrence',
    );
  });
});
