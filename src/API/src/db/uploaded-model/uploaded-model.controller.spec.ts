import { Test, TestingModule } from '@nestjs/testing';
import { UploadedModelController } from './uploaded-model.controller';
import { UploadedModelService } from './uploaded-model.service';

describe('UploadedModelController', () => {
  let controller: UploadedModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadedModelController],
      providers: [UploadedModelService],
    }).compile();

    controller = module.get<UploadedModelController>(UploadedModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
