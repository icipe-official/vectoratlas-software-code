import { Test, TestingModule } from '@nestjs/testing';
import { DoiController } from './doi.controller';
import { DoiService } from './doi.service';

describe('DoiController', () => {
  let controller: DoiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoiController],
      providers: [DoiService],
    }).compile();

    controller = module.get<DoiController>(DoiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
