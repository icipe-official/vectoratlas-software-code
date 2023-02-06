import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { ReviewService } from './review.service';

jest.mock;

describe('ReviewService', () => {
  let service: ReviewService;
  let datasetRepositoryMock: MockType<Repository<Dataset>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,
        {
          provide: getRepositoryToken(Dataset),
          useFactory: repositoryMockFactory,
        },
      ],
      
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    datasetRepositoryMock = module.get(getRepositoryToken(Dataset));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reviewDataset', () => {
    fit('updates status of dataset to in review',async () => {
      await service.reviewDataset('example_id');
      expect(datasetRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    fit('fails to update status', async () => {
      datasetRepositoryMock.save = jest.fn().mockRejectedValue('ERROR');

      await expect(
        service.reviewDataset('example_id'),
      ).rejects.toEqual('ERROR');
    });
  })

});
