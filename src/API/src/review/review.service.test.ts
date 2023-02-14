/* eslint-disable max-len*/
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
import { AuthService } from 'src/auth/auth.service';

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
  let mockAuthService: MockType<AuthService>;

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
    mockAuthService = {
      getEmailFromUserId: jest.fn().mockResolvedValue('testemail'),
      getRoleEmails: jest.fn().mockResolvedValue(['email1', 'email2']),
      init: jest.fn(),
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
        {
          provide: AuthService,
          useValue: mockAuthService,
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
    datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
      UpdatedBy: 'user1',
      ReviewedBy: [],
      ReviewedAt: [],
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reviewDataset', () => {
    it('reviewDataset updates dataset', async () => {
      jest
        .spyOn(httpClient, 'get')
        .mockImplementationOnce(() =>
          rxjs.of({ data: { access_token: 'testtoken', email: 'testemail' } }),
        );
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
        UpdatedBy: 'user1',
        ReviewedBy: [],
        ReviewedAt: [],
      });
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
      expect(datasetRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('should send email', async () => {
      await service.reviewDataset(
        'example_id',
        'reviewer_id',
        'Some reviewer feedback',
      );

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Reviewer Feedback',
        to: ['email1', 'email2', 'testemail'],
        html: `<div>
<h2>Reviewer Feedback</h2>
<p>Dataset with id example_id has been reviewed. Please see review comments below, and visit https://www.vectoratlas.icipe.org/review?dataset=example_id to make changes.
This dataset has been reviewed by reviewer_id</p>
<p>Some reviewer feedback</p>
</div>`,
      });
    });
  });

  describe('approveDataset', () => {
    it('returns httpException on failure', async () => {
      datasetRepositoryMock.findOne = jest.fn().mockRejectedValue('ERROR');
      await expect(
        service.approveDataset('example_id', 'Approver_id'),
      ).rejects.toThrowError(HttpException);
      expect(datasetRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('returns httpException on missing dataset', async () => {
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        service.approveDataset('example_id', 'Approver_id'),
      ).rejects.toThrowError(HttpException);
      expect(datasetRepositoryMock.update).not.toHaveBeenCalled();
    });

    it('does not update if already approved by this user', async () => {
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
        UpdatedBy: 'user1',
        ApprovedBy: ['Approver_id'],
        ApprovedAt: [],
      });
      await service.approveDataset('example_id', 'Approver_id');
      expect(datasetRepositoryMock.update).not.toHaveBeenCalled();
      expect(mockMailerService.sendMail).not.toHaveBeenCalled();
    });

    it('updates to approved if already approved and emails', async () => {
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
        UpdatedBy: 'user1',
        ApprovedBy: ['Approver_id1'],
        ApprovedAt: ['date'],
      });
      await service.approveDataset('example_id', 'Approver_id');
      expect(datasetRepositoryMock.update).toHaveBeenCalledWith(
        { id: 'example_id' },
        {
          UpdatedBy: 'user1',
          ApprovedBy: ['Approver_id1', 'Approver_id'],
          ApprovedAt: ['date', new Date(2020, 3, 1, 0, 0, 0, 0)],
          status: 'Approved',
        },
      );
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('does not update to approved if not already approved and emails', async () => {
      datasetRepositoryMock.findOne = jest.fn().mockResolvedValue({
        UpdatedBy: 'user1',
        ApprovedBy: [],
        ApprovedAt: [],
      });
      await service.approveDataset('example_id', 'Approver_id');
      expect(datasetRepositoryMock.update).toHaveBeenCalledWith(
        { id: 'example_id' },
        {
          UpdatedBy: 'user1',
          ApprovedBy: ['Approver_id'],
          ApprovedAt: [new Date(2020, 3, 1, 0, 0, 0, 0)],
          status: 'In review',
        },
      );
      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });
  });
});
