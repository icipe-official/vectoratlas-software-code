import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { MockType } from 'src/mocks';
import { DatasetController } from './dataset.controller';
import { DatasetService } from './dataset.service';

jest.mock('src/export/utils/allDataCsvCreation', () => ({
  arrayOfFlattenedObjects: jest.fn().mockImplementation((v) => v),
  arrayToCSV: jest.fn().mockImplementation((v) => v),
}));

describe('DatasetController', () => {
  let controller: DatasetController;
  let datasetService: MockType<DatasetService>;
  const sender = {
    send: jest.fn(),
  };
  const response = {
    status: jest.fn().mockReturnValue(sender),
    send: jest.fn(),
    contentType: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    datasetService = {
      findOneByIdWithChildren: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetController],
      providers: [
        {
          provide: DatasetService,
          useValue: datasetService,
        },
      ],
    }).compile();

    controller = module.get<DatasetController>(DatasetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDataSetByid', () => {
    it('throws on error', async () => {
      datasetService.findOneByIdWithChildren = jest
        .fn()
        .mockRejectedValue('ERROR');

      await expect(
        controller.getDataSetByid('id123', response),
      ).rejects.toThrowError(HttpException);
    });

    it('returns 404 on no dataset', async () => {
      datasetService.findOneByIdWithChildren = jest
        .fn()
        .mockResolvedValue(null);

      await controller.getDataSetByid('id123', response);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(sender.send).toHaveBeenCalledWith(
        'Dataset with specified id does not exist',
      );
    });

    it('returns bionomics data', async () => {
      datasetService.findOneByIdWithChildren = jest
        .fn()
        .mockResolvedValue({ bionomics: [1] });

      await controller.getDataSetByid('id123', response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(sender.send).toHaveBeenCalledWith([1]);
    });

    it('returns occurrence data', async () => {
      datasetService.findOneByIdWithChildren = jest
        .fn()
        .mockResolvedValue({ occurrence: [1] });

      await controller.getDataSetByid('id123', response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(sender.send).toHaveBeenCalledWith([1]);
    });
  });
});
