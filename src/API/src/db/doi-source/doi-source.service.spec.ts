import { Test, TestingModule } from '@nestjs/testing';
import { DoiSourceService } from './doi-source.service';

describe('DoiSourceService', () => {
  let service: DoiSourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoiSourceService],
    }).compile();

    service = module.get<DoiSourceService>(DoiSourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
