import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
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
    const user  = {
      sub: 'existing'
    }
    const bionomicsCsv = {
      buffer: Buffer.from('Test bionomics'),
    } as Express.Multer.File;

    await controller.uploadBionomicsCsv(user, bionomicsCsv);

    expect(ingestService.saveBionomicsCsvToDb).toHaveBeenCalledWith(
      'Test bionomics',
    );
  });

  it('should delegate to the ingest service to save occurrence data', async () => {
    const user  = {
      sub: 'existing'
    }
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    await controller.uploadOccurrenceCsv(user, occurrencesCsv);

    expect(ingestService.saveOccurrenceCsvToDb).toHaveBeenCalledWith(
      'Test occurrence',
    );
  });

  describe('uploadBionomicsCsv', () => {
    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.uploadBionomicsCsv,
      );
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });
  });

  describe('uploadOccurrenceCsv', () => {
    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.uploadOccurrenceCsv,
      );
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });
  });
});
