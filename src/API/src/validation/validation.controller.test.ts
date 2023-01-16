import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/mocks';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

describe('ValidationController', () => {
  let controller: ValidationController;
  let validationService: MockType<ValidationService>;

  beforeEach(async () => {
    validationService = {
      validateBionomicsCsv: jest.fn(),
      validateOccurrenceCsv: jest.fn(),
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

    expect(validationService.validateBionomicsCsv).toHaveBeenCalledWith(
      'Test bionomics',
    );
  });

  it('should delegate to the validation service to review occurrence csv data', async () => {
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    await controller.validateOccurrenceCsv(occurrencesCsv);

    expect(validationService.validateOccurrenceCsv).toHaveBeenCalledWith(
      'Test occurrence',
    );
  });
});
