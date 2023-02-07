import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { getAuth0Token, ReviewService } from './review.service';
import * as rxjs from 'rxjs';
import { Logger } from '@nestjs/common';
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
    process.env = {
      REVIEWER_EMAIL_LIST: 'reviewers@gmail.com'
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAuth0Token should return a token', async () => {
    expect(await getAuth0Token(httpClient as unknown as HttpService)).toEqual([
      {data: {access_token: 'testtoken', email:'testemail'} },
    ]);
  });

  it('should send off a post request, from within getAuth0 token', async () => {
    expect(httpClient.post).toHaveBeenCalledWith(
      'https://dev-326tk4zu.us.auth0.com/oauth/token',
    );
    expect(rxjs.lastValueFrom).toHaveBeenCalled();
  });

  describe('reviewDataset', () => {
    it('updates status of dataset to in review',async () => {
      await service.reviewDataset('example_id');
      expect(datasetRepositoryMock.update).toHaveBeenCalledTimes(1);
    });

    it('fails to update status', async () => {
      datasetRepositoryMock.save = jest.fn().mockRejectedValue('ERROR');

      await expect(
        service.reviewDataset('example_id'),
      ).rejects.toEqual('ERROR');
    });
  })

});
