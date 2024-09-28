import { Test, TestingModule } from '@nestjs/testing';
import { DoiSourceController } from './doi-source.controller';
import { DoiSourceService } from './doi-source.service';

describe('DoiSourceController', () => {
  let controller: DoiSourceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoiSourceController],
      providers: [DoiSourceService],
    }).compile();

    controller = module.get<DoiSourceController>(DoiSourceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
