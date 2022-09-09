import { Test, TestingModule } from '@nestjs/testing';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

describe('IngestController', () => {
  let controller: IngestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
    })
      .useMocker((token) => {
        if (token === IngestService) {
          return {
            saveBionomicsCsvToDb: jest.fn(),
            saveOccurrenceCsvToDb: jest.fn(),
          };
        }
      })
      .compile();

    controller = module.get<IngestController>(IngestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
