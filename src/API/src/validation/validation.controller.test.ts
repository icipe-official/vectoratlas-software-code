import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from 'src/mocks';
import { mapValidationIssues, transformHeaderRow } from 'src/utils';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';

jest.mock('src/utils', () => ({
  transformHeaderRow: jest.fn().mockReturnValue('Transformed data'),
  mapValidationIssues: jest.fn().mockReturnValue('Mapped validation issues'),
}))

describe('ValidationController', () => {
  let controller: ValidationController;
  let validationService: MockType<ValidationService>;

  beforeEach(async () => {
    validationService = {
      validateCsv: jest.fn().mockResolvedValue('Validation Issues'),
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

    await controller.validateCsv(bionomicsCsv, 'Vector Atlas', 'bionomics');

    expect(validationService.validateCsv).toHaveBeenCalledWith(
      'Test bionomics',
      'bionomics',
    );
  });

  it('should delegate to the validation service to review occurrence csv data', async () => {
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    await controller.validateCsv(occurrencesCsv, 'Vector Atlas', 'occurrence');

    expect(validationService.validateCsv).toHaveBeenCalledWith(
      'Test occurrence',
      'occurrence',
    );
  });

  it('should map the issues and header if other data source', async () => {
    const occurrencesCsv = {
      buffer: Buffer.from('Test occurrence'),
    } as Express.Multer.File;

    const res = await controller.validateCsv(occurrencesCsv, 'Other', 'occurrence');

    expect(validationService.validateCsv).toHaveBeenCalledWith(
      'Transformed data',
      'occurrence',
    );
    expect(transformHeaderRow).toHaveBeenCalledWith('Test occurrence', 'Other', 'occurrence')
    expect(mapValidationIssues).toHaveBeenCalledWith('Other', 'occurrence', 'Validation Issues')
    expect(res).toEqual('Mapped validation issues')
  });
});
