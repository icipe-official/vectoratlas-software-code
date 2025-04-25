import { Test, TestingModule } from '@nestjs/testing';
import { UploadedModelLogController } from './uploaded-model-log.controller';
import { UploadedModelLogService } from './uploaded-model-log.service';

describe('UploadedModelLogController', () => {
  let controller: UploadedModelLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedModelLogController],
      providers: [UploadedModelLogService],
    }).compile();

    controller = module.get<UploadedModelLogController>(
      UploadedModelLogController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
