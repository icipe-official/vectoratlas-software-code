import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationLogController } from './communication-log.controller';
import { CommunicationLogService } from './communication-log.service';

describe('CommunicationLogController', () => {
  let controller: CommunicationLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationLogController],
      providers: [CommunicationLogService],
    }).compile();

    controller = module.get<CommunicationLogController>(CommunicationLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
