import { Test, TestingModule } from '@nestjs/testing';
import { UploadedModelService } from './model.service';

describe('UploadedModelService', () => {
  let service: UploadedModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadedModelService],
    }).compile();

    service = module.get<UploadedModelService>(UploadedModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
