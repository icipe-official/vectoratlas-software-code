import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { ReviewService } from './review.service';
import * as rxjs from 'rxjs';
import { HttpException, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

jest.mock('@nestjs/axios', () => ({
  HttpService: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('rxjs', () => ({
  lastValueFrom: jest
    .fn((s) => s)
    .mockResolvedValue([
      { data: {access_token: 'testtoken', email:'testemail'} },
    ]),
  map: jest.fn(),
  ...(jest.requireActual('rxjs')as any)
}));

describe('ReviewService', () => {
  let service: ReviewService;
  let httpClient: MockType<HttpService>;
  let datasetRepositoryMock: MockType<Repository<Dataset>>;
  let logger: MockType<Logger>;
  let mockMailerService: MockType<MailerService>;

  beforeEach(async () => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
    };
    mockMailerService = {
      sendMail: jest.fn(),
    };
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),

    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,
        {
          provide: getRepositoryToken(Dataset),
          useFactory: repositoryMockFactory,
        },
        {
          provide: Logger,
          useValue: logger,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: HttpService,
          useValue: httpClient,
        },
      ],

    }).compile();
    // httpClient = module.get<HttpService>(HttpService);
    service = module.get<ReviewService>(ReviewService);
    datasetRepositoryMock = module.get(getRepositoryToken(Dataset));
    jest.spyOn(httpClient, 'post').mockImplementationOnce(() => rxjs.of({data: {access_token: 'testtoken', email:'testemail'} }))
    process.env = {
      REVIEWER_EMAIL_LIST: 'reviewers@gmail.com',
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('reviewDataset updates status of dataset to in review',async () => {
    jest.spyOn(httpClient, 'get').mockImplementationOnce(() => rxjs.of({data: {access_token: 'testtoken', email:'testemail'} }))
    datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
      UpdatedBy: 'user1',
    })
    await service.reviewDataset('example_id');
    expect(datasetRepositoryMock.update).toHaveBeenCalledTimes(1);
  });

  it('reviewDataset fails to update status', async () => {
    datasetRepositoryMock.save = jest.fn().mockRejectedValue('ERROR');

    await expect(
      service.reviewDataset('example_id'),
    ).rejects.toThrowError(HttpException);
  });
});
