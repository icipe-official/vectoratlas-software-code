import { Test, TestingModule } from '@nestjs/testing';
import { DatasetResolver } from './dataset.resolver';

describe('DatasetResolver', () => {
  let resolver: DatasetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasetResolver],
    }).compile();

    resolver = module.get<DatasetResolver>(DatasetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
