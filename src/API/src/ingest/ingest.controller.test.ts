import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { MockType } from 'src/mocks';
import { ValidationService } from 'src/validation/validation.service';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';


describe('IngestController', () => {
  let controller: IngestController;
  let ingestService: MockType<IngestService>;
  let validationService: MockType<ValidationService>;
  let mockMailerService: Partial<MailerService>;

  beforeEach(async () => {
    ingestService = {
      saveBionomicsCsvToDb: jest.fn(),
      saveOccurrenceCsvToDb: jest.fn(),
      validUser: jest.fn(),
    };

    validationService = {
      validateBionomicsCsv: jest.fn(),
      validateOccurrenceCsv: jest.fn(),
    };

    mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestController],
      providers: [
        {
          provide: IngestService,
          useValue: ingestService,
        },
        {
          provide: ValidationService,
          useValue: validationService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
  });

  describe('uploadBionomicsCsv', () => {
    it('should delegate to the ingest service, if valid user with no validation errors', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateBionomicsCsv = jest
        .fn()
        .mockResolvedValue([[]]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadBionomicsCsv(bionomicsCsv, user);

      expect(ingestService.saveBionomicsCsvToDb).toHaveBeenCalledWith(
        'Test bionomics',
        'existing',
        undefined,
      );
    });

    it('should return error if invalid data', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateBionomicsCsv = jest
        .fn()
        .mockResolvedValue(['error']);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadBionomicsCsv(bionomicsCsv, user),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should return error if invalid dataset', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateBionomicsCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(false);

      await expect(
        controller.uploadBionomicsCsv(bionomicsCsv, user, 'id123'),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should return error if invalid user', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateBionomicsCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(false);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadBionomicsCsv(bionomicsCsv, user, 'id123'),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.uploadBionomicsCsv,
      );
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should send email', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateBionomicsCsv = jest
        .fn()
        .mockResolvedValue([[]]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);
      await controller.uploadBionomicsCsv(
        bionomicsCsv,
        user,
        'id123',);

      process.env.REVIEWER_EMAIL_LIST = 'test@reviewer.com';
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Review request',
        to: 'test@reviewer.com',
        html: `<div>
        <h2>Review Request</h2>
        <p>To review this upload, please visit http://www.vectoratlas.icipe.org/review/id123</p>
        </div>`,
      });
    });
  });

  describe('uploadOccurrenceCsv', () => {
    it('should delegate to the ingest service to save occurrence data, if valid', async () => {
      const user = {
        sub: 'existing',
      };
      const occurrencesCsv = {
        buffer: Buffer.from('Test occurrence'),
      } as Express.Multer.File;
      validationService.validateOccurrenceCsv = jest
        .fn()
        .mockResolvedValue([[]]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadOccurrenceCsv(occurrencesCsv, user);

      expect(ingestService.saveOccurrenceCsvToDb).toHaveBeenCalledWith(
        'Test occurrence',
        'existing',
        undefined,
      );
    });

    it('should return error if invalid data', async () => {
      const user = {
        sub: 'existing',
      };
      const occurrencesCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateOccurrenceCsv = jest
        .fn()
        .mockResolvedValue(['error']);

      await expect(
        controller.uploadOccurrenceCsv(occurrencesCsv, user),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should return error if invalid dataset', async () => {
      const user = {
        sub: 'existing',
      };
      const occurrencesCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateOccurrenceCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(false);

      await expect(
        controller.uploadOccurrenceCsv(occurrencesCsv, user, 'id123'),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should return error if invalid user', async () => {
      const user = {
        sub: 'existing',
      };
      const occurrencesCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateOccurrenceCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(false);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadOccurrenceCsv(occurrencesCsv, user, 'id123'),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.uploadOccurrenceCsv,
      );
      expect(guards[0]).toBe(AuthGuard('va'));
      expect(guards[1]).toBe(RolesGuard);
    });

    it('should send email', async () => {
      const user = {
        sub: 'existing',
      };
      const occurrencesCsv = {
        buffer: Buffer.from('Test occurrence'),
      } as Express.Multer.File;
      validationService.validateOccurrenceCsv = jest
        .fn()
        .mockResolvedValue([[]]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadOccurrenceCsv(
        occurrencesCsv,
        user,
        'id123',);

      process.env.REVIEWER_EMAIL_LIST = 'test@reviewer.com';
      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Review request',
        to: 'test@reviewer.com',
        html: `<div>
        <h2>Review Request</h2>
        <p>To review this upload, please visit http://www.vectoratlas.icipe.org/review/id123</p>
        </div>`,
      });
    });
  });
});
