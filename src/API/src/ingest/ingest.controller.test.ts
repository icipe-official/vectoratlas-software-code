import { MailerService } from '@nestjs-modules/mailer';
import { HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { MockType } from 'src/mocks';
import { transformHeaderRow } from 'src/utils';
import { ValidationService } from 'src/validation/validation.service';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

jest.mock('src/utils', () => ({
  transformHeaderRow: jest.fn().mockReturnValue('Transformed data'),
}));

describe('IngestController', () => {
  let controller: IngestController;
  let ingestService: MockType<IngestService>;
  let validationService: MockType<ValidationService>;
  let mockMailerService: MockType<MailerService>;
  let mockAuthService: MockType<AuthService>;

  beforeEach(async () => {
    ingestService = {
      saveBionomicsCsvToDb: jest.fn().mockReturnValue('id123'),
      saveOccurrenceCsvToDb: jest.fn().mockReturnValue('id123'),
      validUser: jest.fn(),
    };

    validationService = {
      validateCsv: jest.fn(),
    };

    mockMailerService = {
      sendMail: jest.fn(),
    };

    mockAuthService = {
      getRoleEmails: jest.fn().mockResolvedValue(['email1', 'email2']),
      init: jest.fn(),
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
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<IngestController>(IngestController);
    ingestService.doiExists = jest.fn().mockResolvedValue(false);
  });

  describe('uploadCsv', () => {
    it('should delegate to the ingest service for bionomics data', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadCsv(
        bionomicsCsv,
        user,
        'Vector Atlas',
        'bionomics',
      );

      expect(ingestService.saveBionomicsCsvToDb).toHaveBeenCalledWith(
        'Test bionomics',
        'existing',
        undefined,
        undefined,
      );
    });

    it('should delegate to the ingest service for occurrence data', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test occurrence'),
      } as Express.Multer.File;
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadCsv(
        bionomicsCsv,
        user,
        'Vector Atlas',
        'occurrence',
      );

      expect(ingestService.saveOccurrenceCsvToDb).toHaveBeenCalledWith(
        'Test occurrence',
        'existing',
        undefined,
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
      validationService.validateCsv = jest.fn().mockResolvedValue(['error']);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadCsv(bionomicsCsv, user, 'Vector Atlas', 'bionomics'),
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
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(false);

      await expect(
        controller.uploadCsv(
          bionomicsCsv,
          user,
          'Vector Atlas',
          'bionomics',
          'id123',
        ),
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
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(false);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadCsv(
          bionomicsCsv,
          user,
          'Vector Atlas',
          'bionomics',
          'id123',
        ),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should return error if existing doi', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test bionomics'),
      } as Express.Multer.File;
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(false);
      ingestService.validDataset = jest.fn().mockResolvedValue(false);
      ingestService.doiExists = jest.fn().mockResolvedValue(true);

      await expect(
        controller.uploadCsv(
          bionomicsCsv,
          user,
          'Vector Atlas',
          'bionomics',
          'id123',
          'doi123',
        ),
      ).rejects.toThrowError(HttpException);

      expect(ingestService.saveBionomicsCsvToDb).not.toHaveBeenCalled();
    });

    it('should ensure the guards are applied', async () => {
      const guards = Reflect.getMetadata('__guards__', controller.uploadCsv);
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
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);
      await controller.uploadCsv(
        bionomicsCsv,
        user,
        'Vector Atlas',
        'bionomics',
        'id123',
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Review request',
        to: ['email1', 'email2'],
        html: `<div>
    <h2>Review Request</h2>
    <p>To review this upload, please visit https://www.vectoratlas.icipe.org/review?dataset=id123</p>
    </div>`,
      });
    });

    it('should transform header row if mapping for other data source', async () => {
      const user = {
        sub: 'existing',
      };
      const bionomicsCsv = {
        buffer: Buffer.from('Test occurrence'),
      } as Express.Multer.File;
      validationService.validateCsv = jest.fn().mockResolvedValue([]);
      ingestService.validUser = jest.fn().mockResolvedValue(true);
      ingestService.validDataset = jest.fn().mockResolvedValue(true);

      await controller.uploadCsv(bionomicsCsv, user, 'Other', 'occurrence');

      expect(ingestService.saveOccurrenceCsvToDb).toHaveBeenCalledWith(
        'Transformed data',
        'existing',
        undefined,
        undefined,
      );
      expect(transformHeaderRow).toHaveBeenCalledWith(
        'Test occurrence',
        'Other',
        'occurrence',
      );
    });
  });
});
