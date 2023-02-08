import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { Repository } from 'typeorm';
import { getAuth0Token, ReviewService } from './review.service';
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
      { data: { access_token: 'testtoken', email: 'testemail' } },
    ]),
  map: jest.fn(),
  ...(jest.requireActual('rxjs') as any),
}));

describe('ReviewService', () => {
  let service: ReviewService;
  let httpClient: MockType<HttpService>;
  let datasetRepositoryMock: MockType<Repository<Dataset>>;
  let logger: MockType<Logger>;
  let mockMailerService: MockType<MailerService>;

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1, 0, 0, 0, 0));
  });

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
      providers: [
        ReviewService,
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
    service = module.get<ReviewService>(ReviewService);
    datasetRepositoryMock = module.get(getRepositoryToken(Dataset));
    jest
      .spyOn(httpClient, 'get')
      .mockImplementationOnce(() =>
        rxjs.of({ data: { access_token: 'testtoken', email: 'testemail' } }),
      );
    jest
      .spyOn(httpClient, 'post')
      .mockImplementationOnce(() =>
        rxjs.of({ data: { access_token: 'testtoken', email: 'testemail' } }),
      );
    process.env = {
      REVIEWER_EMAIL_LIST: 'reviewers@gmail.com',
    };
    datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
      UpdatedBy: 'user1',
      ReviewedBy: [],
      ReviewedAt: [],
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAuth0Token should return a token', async () => {
    expect(await getAuth0Token(httpClient as unknown as HttpService)).toEqual(
      'testtoken',
    );
  });

  it('should send off a post request, from within getAuth0 token', async () => {
    await getAuth0Token(httpClient as unknown as HttpService);
    expect(httpClient.post).toHaveBeenCalledWith(
      'https://dev-326tk4zu.us.auth0.com/oauth/token',
      expect.anything(),
      expect.anything(),
    );
  });

  it('reviewDataset updates status of dataset to in review', async () => {
    await service.reviewDataset('example_id', 'reviewer_id', '');
    expect(datasetRepositoryMock.update).toHaveBeenCalledTimes(1);
    const expectedDataset = {
      UpdatedBy: 'user1',
      ReviewedBy: ['reviewer_id'],
      ReviewedAt: [new Date(2020, 3, 1, 0, 0, 0, 0)],
      status: 'In review',
    };
    expect(datasetRepositoryMock.update).toHaveBeenCalledWith(
      { id: 'example_id' },
      expectedDataset,
    );
  });

  it('reviewDataset fails to update status', async () => {
    datasetRepositoryMock.findOne = jest.fn().mockRejectedValue('ERROR');
    await expect(
      service.reviewDataset('example_id', 'reviewer_id', ''),
    ).rejects.toThrowError(HttpException);
  });
  it('should send email', async () => {
    process.env.REVIEWER_EMAIL_LIST = 'test@reviewer.com';
    await service.reviewDataset(
      'example_id',
      'reviewer_id',
      'Some reviewer feedback',
    );

    expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      from: 'vectoratlas-donotreply@icipe.org',
      subject: 'Reviewer Feedback',
      to: ['testemail', 'test@reviewer.com'],
      html: `<div>
<h2>Reviewer Feedback</h2>
<p>Dataset with id example_id has been reviewed. Please see review comments below, and visit http://www.vectoratlas.icipe.org/review?dataset=example_id to make changes.
This dataset has been reviewed by reviewer_id</p>
<p>Some reviewer feedback</p>
</div>`,
    });
  });
});
