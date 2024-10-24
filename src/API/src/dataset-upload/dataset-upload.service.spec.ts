import { Test, TestingModule } from '@nestjs/testing';
import { DatasetUploadService } from './dataset-upload.service';

describe('DatasetUploadService', () => {
  let service: DatasetUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetUploadService],
    }).compile();

    service = module.get<DatasetUploadService>(DatasetUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
