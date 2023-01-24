import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/mocks';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

describe('ValidationController', () => {
  let controller: ValidationController;
  let validationService: MockType<ValidationService>;

  beforeEach(async () => {
    validationService = {
      validateCsv: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidationController],
      providers: [
        {
          provide: ValidationService,
          useValue: validationService,
        },
      ],
    }).compile();

    controller = module.get<ValidationController>(ValidationController);
  });

  it('should delegate to the validation service to review bionomimcs csv data', async () => {
    const bionomicsCsv = {
      buffer: Buffer.from('Test bionomics'),
    } as Express.Multer.File;

    await controller.validateBionomicsCsv(bionomicsCsv);

    expect(validationService.validateCsv).toHaveBeenCalledWith(
      'Test bionomics',
      'bionomics'
    );
  });

  it('should delegate to the validation service to review occurrence csv data', async () => {
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    await controller.validateOccurrenceCsv(occurrencesCsv);

    expect(validationService.validateCsv).toHaveBeenCalledWith(
      'Test occurrence',
      'occurrence'
    );
  });
});
