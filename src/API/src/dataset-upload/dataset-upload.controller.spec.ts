import { Test, TestingModule } from '@nestjs/testing';
import { DatasetUploadController } from './dataset-upload.controller';
import { DatasetService } from './dataset-upload.service';

describe('DatasetUploadController', () => {
  let controller: DatasetUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasetUploadController],
      providers: [DatasetService],
    }).compile();

    controller = module.get<DatasetUploadController>(DatasetUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
