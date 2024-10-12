import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDatasetLogController } from './uploaded-dataset-log.controller';
import { UploadedDatasetLogService } from './uploaded-dataset-log.service';

describe('UploadedDatasetLogController', () => {
  let controller: UploadedDatasetLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedDatasetLogController],
      providers: [UploadedDatasetLogService],
    }).compile();

    controller = module.get<UploadedDatasetLogController>(UploadedDatasetLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
