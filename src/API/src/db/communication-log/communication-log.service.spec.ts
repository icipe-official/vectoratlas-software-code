import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationLogService } from './communication-log.service';

describe('CommunicationLogService', () => {
  let service: CommunicationLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunicationLogService],
    }).compile();

    service = module.get<CommunicationLogService>(CommunicationLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
