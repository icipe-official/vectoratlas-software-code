import { Test, TestingModule } from '@nestjs/testing';
import { UploadedDatasetService } from './uploaded-dataset.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { MockType, repositoryMockFactory } from 'src/mocks';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import {
  CommunicationChannelType,
  UploadedDatasetActionType,
  UploadedDatasetStatus,
} from 'src/commonTypes';
import { AuthService } from 'src/auth/auth.service';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { UploadedDatasetLogService } from '../uploaded-dataset-log/uploaded-dataset-log.service';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { UserRoleService } from 'src/auth/user_role/user_role.service';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { getCurrentUser } from '../doi/util';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';
import * as rxjs from 'rxjs';
import { HttpStatus } from '@nestjs/common';

describe('UploadedDatasetService', () => {
  let service: UploadedDatasetService;
  let uploadedDatasetRepositoryMock;
  let uploadedDatasetLogRepositoryMock;
  let communicationLogRepositoryMock;
  let doiRepositoryMock;
  let httpClient: MockType<HttpService>;
  let mockMailerService: Partial<MailerService>;
  let userRoleRepositoryMock;

  beforeEach(async () => {
    mockMailerService = {
      sendMail: jest.fn(),
    };
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadedDatasetService,
        AuthService,
        CommunicationLogService,
        UploadedDatasetLogService,
        UserRoleService,
        DoiService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: HttpService,
          useValue: httpClient,
        },
        {
          provide: getRepositoryToken(UploadedDataset),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UploadedDatasetLog),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(CommunicationLog),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(UserRole),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(DOI),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UploadedDatasetService>(UploadedDatasetService);

    uploadedDatasetRepositoryMock = module.get(
      getRepositoryToken(UploadedDataset),
    );

    uploadedDatasetLogRepositoryMock = module.get(
      getRepositoryToken(UploadedDatasetLog),
    );

    communicationLogRepositoryMock = module.get(
      getRepositoryToken(CommunicationLog),
    );

    userRoleRepositoryMock = module.get(getRepositoryToken(UserRole));

    doiRepositoryMock = module.get(getRepositoryToken(DOI));
  });

  const makeDataset = () => {
    const dataset = new UploadedDataset();
    dataset.id = '123';
    dataset.uploader_email = 'stevenyaga10@gmail.com';
    dataset.assigned_reviewers = ['stevenyaga@gmail.com'].join(',');
    dataset.description = 'Test description';
    dataset.title = 'Test title';
    return dataset;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Initial upload creates an Uploaded Dataset, Data Log and sends an email', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset = makeDataset();

    jest
      .spyOn(uploadedDatasetLogRepositoryMock, 'save')
      .mockReturnValue(dataset);

    // act
    await service.create(dataset);

    // assert
    expect(uploadedDatasetRepositoryMock.save).toBeCalledWith(dataset);
    expect(uploadedDatasetRepositoryMock.save).toHaveReturnedWith(dataset);

    // check if there is a corresponding dataset log entry
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.NEW_UPLOAD,
        //action_details: expect.stringContaining(dataset.description),
        action_taker: getCurrentUser(),
        action_date: now,
        dataset: dataset,
      }),
    );

    // check that email is sent to the uploader
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.NEW_UPLOAD,
        recipients: expect.stringContaining(dataset.uploader_email),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        message: expect.stringContaining('Do not reply to this email'),
      }),
    );
  });

  it('getUploadedDataset => Should find an Uploaded Dataset given id are return its data', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset = makeDataset();
    const id = dataset.id;

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    // act
    const result = await service.getUploadedDataset(id);

    // assert
    expect(result).toEqual(dataset);
    expect(uploadedDatasetRepositoryMock.findOne).toBeCalledWith({
      where: { id },
    });
    expect(uploadedDatasetRepositoryMock.findOne).toHaveReturnedWith(dataset);
  });

  it('getUploadedDatasets => Should return an array of Uploaded Datasets', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    const datasets = [dataset];

    jest.spyOn(uploadedDatasetRepositoryMock, 'find').mockReturnValue(datasets);

    // act
    const result = await service.getUploadedDatasets();

    // assert
    expect(result).toEqual(datasets);
    expect(uploadedDatasetRepositoryMock.find).toBeCalled();
    expect(uploadedDatasetRepositoryMock.find).toHaveReturnedWith(datasets);
  });

  it('update => Should update existing dataset', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    dataset.status = UploadedDatasetStatus.PENDING;

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    jest.spyOn(uploadedDatasetRepositoryMock, 'save').mockReturnValue(dataset);

    // act
    await service.update(dataset.id, dataset);

    // assert
    expect(uploadedDatasetRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: dataset.id },
    });
    expect(uploadedDatasetRepositoryMock.save).toHaveBeenCalledWith(dataset);
  });

  it('update => Should prevent modification of all except those with Pending status', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    dataset.status = UploadedDatasetStatus.APPROVED;

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    // act and assert
    await expect(service.update(dataset.id, dataset)).rejects.toThrow();
  });

  it('remove => Should find an Uploaded Dataset by a given id, remove and then return Number of affected rows', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    const id = dataset.id;

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'delete')
      .mockReturnValue(dataset);

    // act
    const result = await service.remove(id);

    // assert
    expect(result).toEqual(dataset);
    expect(uploadedDatasetRepositoryMock.findOne).toBeCalledWith({
      where: { id },
    });
    expect(uploadedDatasetRepositoryMock.findOne).toHaveReturnedWith(dataset);
  });

  it('approve => Approve sets status to approved, creates a Data Log and sends an email', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset = new UploadedDataset();
    dataset.id = '123';
    dataset.status = UploadedDatasetStatus.APPROVED;
    dataset.uploader_email = 'stevenyaga@gmail.com';
    dataset.assigned_reviewers = ['stevenyaga@gmail.com'].join(',');
    dataset.description = 'Test description';
    dataset.title = 'Test title';

    jest.spyOn(uploadedDatasetRepositoryMock, 'save').mockReturnValue(dataset);

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    jest.spyOn(httpClient, 'post').mockImplementationOnce(() =>
      rxjs.of({
        data: { attributes: { state: 'draft' }, data: { id: '123' } },
      }),
    );
    // act
    await service.approve(dataset.id);

    // assert
    expect(uploadedDatasetRepositoryMock.save).toBeCalledWith(dataset);
    expect(uploadedDatasetRepositoryMock.save).toHaveReturnedWith(dataset);

    // check if there is a corresponding dataset log entry
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.APPROVE,
        action_details: expect.stringContaining('Dataset approved'),
        //action_date: now, //remove this check since there is a lapse of about 1ms between saving log entry and this line of code
        action_taker: getCurrentUser(),
        dataset: dataset,
      }),
    );

    // check that email is sent to assigned reviewes
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.APPROVE,
        recipients: expect.stringContaining(dataset.assigned_reviewers),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );
  });

  it('approve => Approve sets status to approved, mints a DOI, creates a Data Log and sends emails to uploader and assigned reviewers', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset = new UploadedDataset();
    dataset.id = '123';
    dataset.status = UploadedDatasetStatus.APPROVED;
    dataset.uploader_email = 'stevenyaga@gmail.com';
    dataset.assigned_reviewers = ['stevenyaga@gmail.com'].join(',');
    dataset.description = 'Test description';
    dataset.title = 'Test title';

    const doi = new DOI();
    doi.dataset = dataset;

    jest.spyOn(uploadedDatasetRepositoryMock, 'save').mockReturnValue(dataset);
    jest.spyOn(doiRepositoryMock, 'save').mockReturnValue(doi);

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    jest.spyOn(httpClient, 'post').mockImplementationOnce(() =>
      rxjs.of({
        status: HttpStatus.CREATED,
        attributes: { state: 'draft' },
        data: { id: '123' },
      }),
    );

    // act
    await service.approve(dataset.id);

    // assert
    expect(uploadedDatasetRepositoryMock.save).toBeCalledWith(dataset);
    expect(uploadedDatasetRepositoryMock.save).toHaveReturnedWith(dataset);

    // check if there is a corresponding dataset log entry for Approved
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.APPROVE,
        action_details: expect.stringContaining('Dataset approved'),
        //action_date: now, //remove this check since there is a lapse of about 1ms between saving log entry and this line of code
        action_taker: getCurrentUser(),
        dataset: dataset,
      }),
    );

    // check that email is sent to assigned reviewers for Dataset Approved
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.APPROVE,
        recipients: expect.stringContaining(dataset.assigned_reviewers),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );

    // check if there is a corresponding dataset log entry for DOI generation
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.GENERATE_DOI,
        action_details: expect.stringContaining('Generate DOI'),
        //action_date: now, //remove this check since there is a lapse of about 1ms between saving log entry and this line of code
        action_taker: getCurrentUser(),
        dataset: dataset,
      }),
    );

    // check that email for DOI generation is sent to uploader
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.GENERATE_DOI,
        recipients: expect.stringContaining(dataset.uploader_email),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );

    // check that email for DOI generation is sent to reviewers
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.GENERATE_DOI,
        recipients: expect.stringContaining(dataset.assigned_reviewers),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );
  });

  it('rejectRawDataset => Rejecting raw dataset sets status to rejected, creates a Data Log and sends an email', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    dataset.status = UploadedDatasetStatus.REJECTED;

    jest.spyOn(uploadedDatasetRepositoryMock, 'save').mockReturnValue(dataset);

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    // act
    await service.rejectRawDataset(dataset.id);

    // assert
    expect(uploadedDatasetRepositoryMock.save).toBeCalledWith(dataset);
    expect(uploadedDatasetRepositoryMock.save).toHaveReturnedWith(dataset);

    // check if there is a corresponding dataset log entry
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.REJECT_RAW,
        action_details: expect.stringContaining('Dataset rejected'),
        //action_date: now, //remove this check since there is a lapse of about 1ms between saving log entry and this line of code
        action_taker: getCurrentUser(),
        dataset: dataset,
      }),
    );

    // check that email is sent to assigned reviewes
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.REJECT_RAW,
        recipients: expect.stringContaining(dataset.uploader_email),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );
  });

  it('rejectReviewedDataset => Rejecting reviewed dataset sets status to rejected, creates a Data Log and sends an email', async () => {
    // arrange
    const now = new Date();
    Date.now = jest.fn().mockReturnValue(now);
    const dataset: UploadedDataset = makeDataset();
    dataset.status = UploadedDatasetStatus.REJECTED_BY_MANAGER;

    jest.spyOn(uploadedDatasetRepositoryMock, 'save').mockReturnValue(dataset);

    jest
      .spyOn(uploadedDatasetRepositoryMock, 'findOne')
      .mockReturnValue(dataset);

    // act
    await service.rejectReviewedDataset(dataset.id);

    // assert
    expect(uploadedDatasetRepositoryMock.save).toBeCalledWith(dataset);
    expect(uploadedDatasetRepositoryMock.save).toHaveReturnedWith(dataset);

    // check if there is a corresponding dataset log entry
    expect(uploadedDatasetLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        action_type: UploadedDatasetActionType.REJECT_REVIEWED,
        action_details: expect.stringContaining('Dataset rejected'),
        //action_date: now, //remove this check since there is a lapse of about 1ms between saving log entry and this line of code
        action_taker: getCurrentUser(),
        dataset: dataset,
      }),
    );

    // check that email is sent to assigned reviewes
    expect(communicationLogRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        message_type: UploadedDatasetActionType.REJECT_REVIEWED,
        recipients: expect.stringContaining(dataset.assigned_reviewers),
        channel_type: CommunicationChannelType.EMAIL,
        reference_entity_type: UploadedDataset.name,
        reference_entity_name: dataset.id,
        //message: expect.stringContaining('Do not reply to this email'),
      }),
    );
  });
});
