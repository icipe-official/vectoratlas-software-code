import { Test, TestingModule } from '@nestjs/testing';
import { UploadedModelLogService } from './uploaded-model-log.service';

describe('UploadedModelLogService', () => {
  let service: UploadedModelLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadedModelLogService],
    }).compile();

    service = module.get<UploadedModelLogService>(UploadedModelLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
