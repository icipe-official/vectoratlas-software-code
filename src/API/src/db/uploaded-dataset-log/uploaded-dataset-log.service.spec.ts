import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDatasetLogService } from './uploaded-dataset-log.service';

describe('UploadedDatasetLogService', () => {
  let service: UploadedDatasetLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadedDatasetLogService],
    }).compile();

    service = module.get<UploadedDatasetLogService>(UploadedDatasetLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
