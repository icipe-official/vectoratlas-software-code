import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDatasetController } from './uploaded-dataset.controller';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { UploadedDataset } from './entities/uploaded-dataset.entity';

describe('UploadedDatasetController', () => {
  let controller: UploadedDatasetController;

  const mockUploadedDataService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDatasetController],
      providers: [
        {
          provide: UploadedDatasetService,
          useValue: mockUploadedDataService,
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
    dataset.assigned_reviewers = ['stevenyaga@gmail.com'].join(',');
    dataset.description = 'Test description';
    dataset.title = 'Test title';
    return dataset;
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create => Should create a new Uploaded Dataset', async () => {
    // arrange
    const dataset: UploadedDataset = makeDataset();

    jest.spyOn(mockUploadedDataService, 'create').mockReturnValue(dataset);

    // act
    const newUpload = { id: null, ...dataset } as UploadedDataset; // remove the id value
    const result = await controller.create(newUpload);

    // assert
    expect(mockUploadedDataService.create).toBeCalledWith(newUpload);
    expect(result).toEqual(dataset);
  });

  /*
  it('findAll => Should return an array of uploaded datasets', async () => {
    // arrange
    const dataset: UploadedDataset = makeDataset();
    const datasets = [dataset];

    jest.spyOn(mockUploadedDataService, 'findAll').mockReturnValue(datasets);

    // act
    const result = await controller.findAll();

    // assert
    expect(result).toEqual(datasets);
    expect(mockUploadedDataService.findAll).toBeCalled();
  });

  it('findOne => Should find an uploaded dataset given an id', async () => {
    // arrange
    const dataset: UploadedDataset = makeDataset();

    jest.spyOn(mockUploadedDataService, 'findOne').mockReturnValue(dataset);

    // act
    const result = await controller.findOne(dataset.id);

    // assert
    expect(mockUploadedDataService.findOne).toBeCalledWith(dataset.id);
    expect(result).toEqual(dataset);
  });*/

  it('update => Should find a dataset given id and update', async () => {
    // arrange
    const dataset: UploadedDataset = makeDataset();

    jest.spyOn(mockUploadedDataService, 'update').mockReturnValue(dataset);

    // act
    const result = await controller.update(dataset.id, dataset);

    // expect
    expect(result).toEqual(dataset);
    expect(mockUploadedDataService.update).toHaveBeenCalledWith(
      dataset.id,
      dataset,
    );
  });

  it('remove => Should find a dataset given id and remove the dataset', async () => {
    // arrange
    const dataset: UploadedDataset = makeDataset();

    jest.spyOn(mockUploadedDataService, 'remove').mockReturnValue(dataset);

    // act
    const result = await controller.remove(dataset.id);

    // assert
    expect(result).toEqual(dataset);
    expect(mockUploadedDataService.remove).toHaveBeenCalledWith(dataset.id);
  });
});
