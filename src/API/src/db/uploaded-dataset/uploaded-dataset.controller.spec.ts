import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UploadedDatasetController } from './uploaded-dataset.controller';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { OrganizationService } from '../organization/organization.service';

describe('UploadedDatasetController', () => {
  let controller: UploadedDatasetController;

  const mockUploadedDataService = {
    getUploadedDatasets: jest.fn(),
    getUploadedDataset: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    firstUpload: jest.fn(),
  };

  const mockOrganizationService = {
    findOne: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDatasetController],
      providers: [
        {
          provide: UploadedDatasetService,
          useValue: mockUploadedDataService,
        },
        {
          provide: OrganizationService,
          useValue: mockOrganizationService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<UploadedDatasetController>(
      UploadedDatasetController,
    );
  });

  const makeDataset = () => {
    const dataset = new UploadedDataset();
    dataset.id = '123';
    dataset.uploader_email = 'stevenyaga10@gmail.com';
    dataset.primary_reviewers = ['stevenyaga@gmail.com'];
    dataset.tertiary_reviewers = ['stevenyaga2@gmail.com'];
    dataset.source_country = 'Kenya';
    dataset.source_region = 'Kisumu';
    dataset.is_va_data = false;
    dataset.is_doi_requested = false;
    dataset.description = 'Test description';
    dataset.title = 'Test title';
    return dataset;
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return uploaded datasets', async () => {
    const datasets = [makeDataset()];
    mockUploadedDataService.getUploadedDatasets.mockResolvedValue(datasets);

    const result = await controller.findAll();

    expect(mockUploadedDataService.getUploadedDatasets).toHaveBeenCalled();
    expect(result).toEqual(datasets);
  });

  it('findOne should return an uploaded dataset', async () => {
    const dataset = makeDataset();
    mockUploadedDataService.getUploadedDataset.mockResolvedValue(dataset);

    const result = await controller.findOne(dataset.id);

    expect(mockUploadedDataService.getUploadedDataset).toHaveBeenCalledWith(
      dataset.id,
    );
    expect(result).toEqual(dataset);
  });

  it('update should update an uploaded dataset', async () => {
    const dataset = makeDataset();
    const userId = 'test-user-id';
    mockUploadedDataService.update.mockResolvedValue(dataset);

    const result = await controller.update(
      { sub: userId },
      dataset.id,
      dataset,
    );

    expect(mockUploadedDataService.update).toHaveBeenCalledWith(
      dataset.id,
      dataset,
      userId,
      undefined,
    );
    expect(result).toEqual(dataset);
  });

  it('remove should delete an uploaded dataset', async () => {
    const dataset = makeDataset();
    mockUploadedDataService.remove.mockResolvedValue(dataset);

    const result = await controller.remove(dataset.id);

    expect(mockUploadedDataService.remove).toHaveBeenCalledWith(dataset.id);
    expect(result).toEqual(dataset);
  });
});
