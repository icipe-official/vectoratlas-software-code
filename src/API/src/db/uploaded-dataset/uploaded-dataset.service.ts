import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { UploadedDataset } from './entities/uploaded-dataset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedDatasetLog } from '../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { UploadedDatasetLogService } from '../uploaded-dataset-log/uploaded-dataset-log.service';
import {
  ApprovalStatus,
  CommunicationChannelType,
  CommunicationSentStatus,
  DOISourceType,
  UploadedDatasetActionTypeEnum,
  UploadedDatasetStatus,
} from 'src/commonTypes';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { CommunicationLogService } from '../communication-log/communication-log.service';
import { AuthService } from 'src/auth/auth.service';
import {
  getApproveDataSetTemplate,
  getRejectRawDataSetTemplate,
  getRejectReviewedDataSetTemplate,
  getNewUploadDataSetTemplate,
  getReviewDataSetTemplate,
  getAssignPrimaryReviewerTemplate,
  getAssignTertiaryReviewerTemplate,
  getRequestReuploadDataSetTemplate,
} from '../../../templates/uploadedDataset';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';
import { EmailService } from '../../email/email.service';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import axios from 'axios';
import * as fs from 'fs';
import FormData = require('form-data');
import { DatasetService } from '../shared/dataset.service';
import {
  ensureDirectoryExists,
  makeFileNameTimestamped,
  makeResponse,
} from 'src/utils';
import { Roles, ROLES_KEY } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { strict } from 'assert';
import { BlobDownloadResponseParsed } from '@azure/storage-blob';
import { Readable } from 'stream';
import { UserRole } from 'src/auth/user_role/user_role.entity';

const RAW_DATASET_CONTAINER = 'raw';
const PRIMARY_REVIEWED_CONTAINER = 'primary-reviewed';
const TERTIARY_REVIEWED_CONTAINER = 'tertiary-reviewed';
const FILE_STORAGE_TYPE = process.env.FILE_STORAGE_TYPE; // one of AZURE or LOCAL

@Injectable()
export class UploadedDatasetService {
  constructor(
    @InjectRepository(UploadedDataset)
    private uploadedDataRepository: Repository<UploadedDataset>,
    private authService: AuthService,
    private uploadedDataLogService: UploadedDatasetLogService,
    private logger: Logger,
    private emailService: EmailService,
    private azureBlobService: AzureBlobService,
    private datasetService: DatasetService,
    @Inject(forwardRef(() => DoiService))
    private readonly doiService: DoiService,
  ) {}

  async getUploadedDatasets() {
    return await this.uploadedDataRepository.find({
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUploadedDatasetsByUploader(uploader: string) {
    return await this.uploadedDataRepository.find({
      where: { owner: uploader },
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUploadedDataset(id: string) {
    const res = await this.uploadedDataRepository.findOne({
      where: { id },
      relations: ['uploaded_dataset_log'],
      order: {
        uploaded_dataset_log: {
          creation: 'DESC',
        },
      },
    });
    return res;
  }

  async validateUser(id: string, userId: string) {
    return await this.uploadedDataRepository.findOne({
      where: { id, owner: userId },
    });
  }

  async update(id: string, uploadedDataset: UploadedDataset, userId: string) {
    const toUpdate = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.getModifiableStatus().includes(uploadedDataset.status)) {
      const error = `The dataset cannot be modified since it has ${uploadedDataset.status} status`;
      // throw new Error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }

    const updated = Object.assign(toUpdate, uploadedDataset);
    updated.updater = userId;
    const res = await this.uploadedDataRepository.save(updated);

    // save dataset log
    const actionType = UploadedDatasetActionTypeEnum.UPDATE;
    await this.saveLog(
      actionType,
      updated.description || updated.title,
      res,
      userId,
    );
    return res;
  }

  /**
   * Read file into memory from Blob Storage
   * @param fileName
   * @param containerName
   * @returns
   */
  readFile = async (datasetId: string) => {
    const dataset = await this.getUploadedDataset(datasetId);
    const { containerName, fileName } = this.getContainerName(dataset);
    // const file = await this.azureBlobService.getFile(fileName, containerName);
    const file = await this.downloadToFileStorage(
      fileName,
      process.env.TEMP_DIR,
    );
    return file;
  };

  /**
   * Get container name based on status
   * @param datasetStatus
   * @returns
   */
  getContainerName = (dataset: UploadedDataset) => {
    const datasetStatus = dataset.status;
    let containerName = RAW_DATASET_CONTAINER;
    let fileName = dataset.uploaded_file_name;
    if (
      datasetStatus == UploadedDatasetStatus.PENDING ||
      datasetStatus == UploadedDatasetStatus.REJECTED
    ) {
      containerName = RAW_DATASET_CONTAINER;
      fileName = dataset.uploaded_file_name;
    }
    if (datasetStatus == UploadedDatasetStatus.PRIMARY_REVIEW) {
      containerName = PRIMARY_REVIEWED_CONTAINER;
      fileName = dataset.uploaded_file_name_primary_reviewed;
    }
    if (
      datasetStatus == UploadedDatasetStatus.TERTIARY_REVIEW ||
      datasetStatus == UploadedDatasetStatus.PENDING_APPROVAL ||
      datasetStatus == UploadedDatasetStatus.APPROVED ||
      datasetStatus == UploadedDatasetStatus.REJECTED_BY_MANAGER
    ) {
      containerName = TERTIARY_REVIEWED_CONTAINER;
      fileName = dataset.uploaded_file_name_tertiary_reviewed;
    }
    return { containerName, fileName };
  };

  /**
   * Internal method to upload file to blob
   * @param file
   * @param directory
   * @returns
   */
  _doUpload = async (file: Express.Multer.File, directory: string) => {
    if (FILE_STORAGE_TYPE === 'Azure') {
      const uploadedUrl = await this.azureBlobService.upload(file, directory);
      return uploadedUrl;
    } else {
      return file.path;
    }
  };

  /**
   * Upload for the first time
   * @param dataset
   * @param file
   * @returns
   */
  async firstUpload(
    dataset: UploadedDataset,
    file: Express.Multer.File,
    userId: string,
  ) {
    const uploadedUrl = await this._doUpload(file, RAW_DATASET_CONTAINER);
    dataset.uploaded_file_name = uploadedUrl; // set uploaded file url
    dataset.last_upload_date = new Date();
    dataset.last_status_update_date = new Date();
    dataset.status = UploadedDatasetStatus.PENDING;
    dataset.uploader = userId;
    dataset.dataset_type = dataset.dataset_type;
    dataset.owner = userId;
    const res = await this.uploadedDataRepository.save(dataset);
    // Save dataset log
    const actionType = UploadedDatasetActionTypeEnum.NEW_UPLOAD;
    await this.saveLog(
      actionType,
      dataset.description || dataset.title,
      res,
      userId,
    );

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      dataset,
      actionType,
      'New dataset upload',
    );
    // const uploader_email = await this.getUserEmail(userId);
    await this.communicate(res, actionType, [userId], message, userId);

    // notify all reviewers
    const recipients = await this.getReviewers(dataset, true);
    await this.communicate(dataset, actionType, recipients, message, userId);
    return res;
  }

  allowReupload = (dataset: UploadedDataset) => {
    return (
      dataset.status == UploadedDatasetStatus.PRIMARY_REVIEW &&
      dataset.is_reupload_requested &&
      !dataset.is_reuploaded
    );
  };

  async remove(id: string) {
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    //return await this.uploadedDataRepository.remove(dataset);
    return await this.uploadedDataRepository.delete(id);
  }

  /**
   * Approve an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to reviewer
   * @param id
   */
  async approve(id: string, comments: string, userId: string) {
    let error = '';
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    if (!dataset.primary_reviewers) {
      error = 'There are no assigned primary reviewers for this dataset';
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (!dataset.tertiary_reviewers) {
      error = 'There are no tertiary reviewers for this dataset';
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (dataset.status == UploadedDatasetStatus.APPROVED) {
      error = 'Dataset is already approved';
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (dataset.approved_by?.includes(userId)) {
      // user has already approved
      this.logger.error('User has already approved this dataset');
      return makeResponse({
        isError: true,
        error: 'User has already approved this dataset',
      });
    }

    // ingest data first
    const ingestRes = await this.ingest(id);
    if (!ingestRes.success) {
      //   'Dataset contains errors. Please go to validate dataset menu to view error details',
      // );
      this.logger.error(
        'Dataset contains errors. Please go to validate dataset menu to view error details',
      );
      return makeResponse({
        isError: true,
        data: ingestRes.data,
        error:
          'Dataset contains errors. Please go to validate dataset menu to view error details',
      });
    }

    // update dataset with the uploaded dataset id that generated it
    await this.datasetService.updateUploadedDatasetId(
      ingestRes.data['dataset_id'],
      dataset,
    );

    const now = new Date();
    dataset.status = UploadedDatasetStatus.APPROVED;
    dataset.last_status_update_date = now;
    dataset.approved_by = (dataset.approved_by || []).concat(userId);
    dataset.approved_on = now;
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.APPROVE;
    await this.saveLog(
      actionType,
      comments || 'Dataset approved',
      dataset,
      userId,
    );

    // mint DOI if it was requested
    if (dataset.is_doi_requested) {
      let doi = new DOI();
      const exists = await this.doiService.getDOIByUploadedDataset(dataset.id);
      if (exists !== undefined) {
        doi = exists;
      }
      doi.approval_status = ApprovalStatus.PENDING;
      doi.creator = dataset.uploader;
      // doi.creator_email = await this.getUserEmail(dataset.owner)// dataset.uploader_email;
      // doi.creator_name = dataset.uploader_name;
      doi.publication_year = new Date().getFullYear();
      doi.source_type = DOISourceType.UPLOAD;
      doi.title = dataset.title;
      doi.description = dataset.description;
      doi.meta_data = { filters: {}, fields: [] };
      doi.uploaded_dataset = dataset;
      doi.owner = userId;
      doi.updater = userId;
      await this.doiService.upsert(doi);
      //const doiRes = await this.doiService.generateDOI(doi);
      // const uploader_email = dataset.owner
      //   ? await this.getUserEmail(dataset.owner)
      //   : null; // dataset.uploader_email?.trim();

      const reviewers = await this.getReviewers(dataset, false);
      const recipients = dataset.owner
        ? [...reviewers, dataset.owner]
        : [...reviewers];
      const doiRes = await this.doiService.approveDOI(
        doi.id,
        userId,
        comments,
        recipients,
      );

      if (doiRes) {
        // Save dataset log
        await this.saveLog(
          UploadedDatasetActionTypeEnum.GENERATE_DOI,
          'Generate DOI',
          dataset,
          userId,
        );

        // notify assigned reviewers
        // const reviewers = await this.getReviewers(dataset, false);
        const doiMessage = await this.makeMessage(
          dataset,
          UploadedDatasetActionTypeEnum.GENERATE_DOI,
          '',
        );
        // send email to reviewers
        // await this.communicate(
        //   dataset,
        //   UploadedDatasetActionTypeEnum.GENERATE_DOI,
        //   reviewers,
        //   doiMessage,
        // );

        // notify uploader
        // const uploader_email = [dataset.uploader_email?.trim()];
        // doiMessage = await this.makeMessage(
        //   dataset,
        //   UploadedDatasetActionTypeEnum.GENERATE_DOI,
        // );

        await this.communicate(
          dataset,
          UploadedDatasetActionTypeEnum.GENERATE_DOI,
          dataset.owner,
          doiMessage,
          userId,
        );
      }
    }

    // notify all + assigned reviewers
    // @TODO: Modify unit test to reflect sending emails to all reviewers
    let recipients = await this.getReviewers(dataset, true);
    const reviewerManagers = await this.getReviewerManagers();
    recipients = recipients.concat(reviewerManagers);
    const message = await this.makeMessage(dataset, actionType, '');
    await this.communicate(dataset, actionType, recipients, message, userId);

    return res;
  }

  /**
   * Review an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param id
   */
  async review(datasetId: string, reviewComment: string, userId: string) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    // No updating status in a review
    // dataset.status = UploadedDatasetStatus.APPROVED;
    // dataset.last_status_update_date = new Date();
    // const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.REVIEW;
    const res = await this.saveLog(
      actionType,
      reviewComment || 'Dataset reviewed',
      dataset,
      userId,
    );
    // notify assigned reviewers
    const recipients = await this.getReviewers(dataset, false);
    const message = await this.makeMessage(dataset, actionType, reviewComment);
    await this.communicate(dataset, actionType, recipients, message, userId);
    return res;
  }

  /**
   * Assign primary reviewer(s) to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param primaryReviewers
   * @param comments
   * @returns
   */
  async assignPrimaryReviewer(
    datasetId: string,
    primaryReviewers: string | string[],
    comments: string,
    userId: string,
  ) {
    if (typeof primaryReviewers === 'string') {
      primaryReviewers = [primaryReviewers];
    }
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    const reviewers = (dataset.primary_reviewers || []).concat(
      primaryReviewers,
    );
    const finalReviewers = [...new Set(reviewers)];
    dataset.status = UploadedDatasetStatus.PRIMARY_REVIEW;
    dataset.primary_reviewers = [].concat(primaryReviewers);
    dataset.last_status_update_date = new Date();
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS;
    await this.saveLog(
      actionType,
      comments || 'Assign Primary Reviewers',
      dataset,
      userId,
    );

    // notify assigned primary reviewers
    if (finalReviewers) {
      const recipients = await this.getPrimaryReviewers(dataset); // finalReviewers;
      const message = await this.makeMessage(dataset, actionType, comments);
      await this.communicate(dataset, actionType, recipients, message, userId);
    }
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Complete primary review to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param uploaded_file_name
   * @param comments
   * @param otherRecipients
   * @returns
   */
  // @UseInterceptors(FileInterceptor('file'))
  async completePrimaryReview(
    datasetId: string,
    // uploaded_file_name: string,
    file: Express.Multer.File,
    comments: string,
    // otherRecipients?: [string],
    userId: string,
  ) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });

    const reviewerManagers = await this.getReviewerManagers();
    const primaryReviewers = await this.getPrimaryReviewers(dataset);

    const recipients = (primaryReviewers || []).concat(reviewerManagers);

    const uploadedUrl = await this._doUpload(file, PRIMARY_REVIEWED_CONTAINER); //upload file
    dataset.status = UploadedDatasetStatus.PENDING_ASSIGNING_TERTIARY_REVIEW;
    dataset.last_status_update_date = new Date();
    dataset.uploaded_file_name_primary_reviewed = uploadedUrl; //update uploaded file url
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.COMPLETE_PRIMARY_REVIEW;
    await this.saveLog(
      actionType,
      comments || 'Complete Primary Review',
      dataset,
      userId,
    );

    // notify assigned reviewers and other reviewers
    const message = await this.makeMessage(dataset, actionType, comments);
    await this.communicate(dataset, actionType, recipients, message, userId);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Complete tertiary review to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param uploaded_file_name
   * @param comments
   * @param otherRecipients
   * @returns
   */
  async completeTertiaryReview(
    datasetId: string,
    // uploaded_file_name: string,
    file: Express.Multer.File,
    comments: string,
    userId: string,
  ) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    const reviewers = await this.getReviewers(dataset, true);

    const uploadedUrl = await this._doUpload(file, TERTIARY_REVIEWED_CONTAINER); //upload file
    dataset.status = UploadedDatasetStatus.PENDING_APPROVAL;
    dataset.last_status_update_date = new Date();
    dataset.uploaded_file_name_tertiary_reviewed = uploadedUrl; // update uploaded file url
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.COMPLETE_TERTIARY_REVIEW;
    await this.saveLog(
      actionType,
      comments || 'Complete Tertiary Review',
      dataset,
      userId,
    );

    // notify assigned reviewers and other recipients
    const recipients = reviewers;
    const message = await this.makeMessage(dataset, actionType, comments);
    await this.communicate(dataset, actionType, recipients, message, userId);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Assign primary reviewer(s) to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param primaryReviewers
   * @param comments
   * @returns
   */
  async assignTertiaryReviewer(
    datasetId: string,
    tertiaryReviewers: string | string[],
    comments: string,
    userId: string,
  ) {
    if (typeof tertiaryReviewers === 'string') {
      tertiaryReviewers = [tertiaryReviewers];
    }
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    const reviewers = (dataset.tertiary_reviewers || []).concat(
      tertiaryReviewers,
    );

    const finalReviewers = [...new Set(reviewers)];
    dataset.status = UploadedDatasetStatus.TERTIARY_REVIEW;
    dataset.tertiary_reviewers = finalReviewers; // [].concat(tertiaryReviewers);
    dataset.last_status_update_date = new Date();
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS;
    await this.saveLog(
      actionType,
      comments || 'Assign Tertiary Reviewers',
      dataset,
      userId,
    );

    // notify only the newly assigned reviewers
    if (tertiaryReviewers.length > 0) {
      const message = await this.makeMessage(dataset, actionType, comments);
      await this.communicate(
        dataset,
        actionType,
        tertiaryReviewers,
        message,
        userId,
      );
    }
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reject an uploaded dataset that has just been uploaded by a public user
   * @param id
   */
  async rejectRawDataset(id: string, comments: string, userId: string) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    dataset.status = UploadedDatasetStatus.REJECTED;
    dataset.last_status_update_date = new Date();
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    //Save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.REJECT_RAW;
    await this.saveLog(
      actionType,
      comments || 'Reject Dataset',
      dataset,
      userId,
    );

    // Notify uploader + reviewers + reviewe managers
    const reviewers = await this.getReviewers(dataset, false);
    const recipients = (reviewers || []).concat(dataset.owner);
    const message = await this.makeMessage(dataset, actionType, comments);
    await this.communicate(dataset, actionType, recipients, message, userId);

    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reject an uploaded dataset that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async rejectReviewedDataset(id: string, comments: string, userId: string) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    dataset.status = UploadedDatasetStatus.REJECTED_BY_MANAGER;
    dataset.last_status_update_date = new Date();
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.REJECT_REVIEWED;
    await this.saveLog(
      actionType,
      comments || 'Reviewed Dataset rejected',
      dataset,
      userId,
    );

    // notify assigned reviewers
    const recipients = await this.getReviewers(dataset, false);
    if (recipients.length > 0) {
      const message = await this.makeMessage(dataset, actionType, comments);
      await this.communicate(dataset, actionType, recipients, message, userId);
    } else {
      const error = 'This dataset does not have an assigned reviewer';
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }

    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reject an uploaded dataset that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async sendAdhocCommunication(
    id: string,
    message: string,
    recipientEmails: string[],
    files: Express.Multer.File | Express.Multer.File[],
    userId: string,
  ) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });

    // save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.SEND_EMAIL;
    const res = await this.saveLog(
      actionType,
      message || 'Communication Sent',
      dataset,
      userId,
    );

    // notify recipients
    if (recipientEmails && recipientEmails.length > 0) {
      // const message = await this.makeMessage(dataset, actionType, comments);
      await this.communicate(
        dataset,
        actionType,
        recipientEmails,
        message,
        userId,
        files,
      );
    } else {
      const error = 'Recipients for this communication have not been set';
      this.logger.error(error);
      // throw 'Recipients for this communication have not been set';
      return makeResponse({
        isError: true,
        error,
      });
    }

    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reject an uploaded dataset that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async requestReupload(id: string, comments: string, userId: string) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    if (dataset.status != UploadedDatasetStatus.PRIMARY_REVIEW) {
      this.logger.error('The dataset must be under primary review');
      throw new HttpException('The dataset must be under primary review', 500);
    }
    dataset.is_reupload_requested = true;
    dataset.reupload_requested_date = new Date();
    dataset.reupload_request_comment = comments;
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // save dataset log
    const actionType: UploadedDatasetActionTypeEnum =
      UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD;
    await this.saveLog(
      actionType,
      comments || 'Request Dataset Re-upload',
      dataset,
      userId,
    );

    // notify assigned reviewers 
    const recipients = [userId];
    const message = await this.makeMessage(dataset, actionType, comments);
    await this.communicate(dataset, actionType, recipients, message, userId);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /***
   * Reupload dataset file
   */
  async reUpload(
    id: string,
    file: Express.Multer.File,
    comments: string,
    userId: string,
  ) {
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.allowReupload(dataset)) {
      this.logger.error(
        'You cannot perform a dataset reupload to this dataset',
      );
      throw 'You cannot perform a dataset reupload to this dataset';
    }

    const uploadedUrl = await this._doUpload(file, RAW_DATASET_CONTAINER); //upload file

    dataset.is_reupload_requested = false;
    dataset.last_upload_date = new Date();
    dataset.uploaded_file_name = uploadedUrl; // set uploaded file url
    dataset.reupload_comment = comments;
    dataset.is_reuploaded = true;
    dataset.reupload_date = new Date();
    dataset.updater = userId;
    const res = await this.uploadedDataRepository.save(dataset);

    // save dataset log
    const actionType = UploadedDatasetActionTypeEnum.REUPLOAD;
    const actionDetails = `${
      dataset.description || dataset.title
    }. Previous file=${dataset.uploaded_file_name}. Comments=${comments}`;
    await this.saveLog(actionType, actionDetails, res, userId);

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      dataset,
      actionType,
      'Dataset re-upload',
    );
    // const uploader_email = await this.getUserEmail(userId);
    this.communicate(res, actionType, [userId], message, userId);

    // notify only the assigned reviewers
    const recipients = await this.getReviewers(dataset, false);
    await this.communicate(dataset, actionType, recipients, message, userId);
    return res;
  }

  /**
   * Make a communication against the uploaded dataset
   * @param id
   */
  async communicate(
    uploadedDataset: UploadedDataset,
    actionType: UploadedDatasetActionTypeEnum,
    recipients: string | string[],
    message: string,
    userId: string,
    files?: Express.Multer.File | Express.Multer.File[],
  ) {
    //check if notifications have been disabled
    recipients = typeof recipients == 'string' ? [recipients] : recipients;

    interface IdEmailMap {
      id: string;
      email: string;
    }

    const toSend: IdEmailMap[] = [];
    for (const userId of recipients) {
      if (userId) {
        if (userId.indexOf('|') == -1) {
          //auth0 ids have a | appearing. if its missing, then its an email
          toSend.push({ id: userId, email: userId });
        } else {
          const disabled = await this.authService.isNotificationsDisabled(
            userId,
          );
          const email = await this.getUserEmail(userId);
          if (!disabled && email) {
            toSend.push({ id: userId, email });
          }
        }
      }
    }

    if (toSend.length === 0) {
      // if there are no recipients, no need to continue
      return;
    }

    // create a communication log
    const comm = new CommunicationLog();
    comm.channel_type = CommunicationChannelType.EMAIL;
    comm.recipients = [].concat(toSend.map((el) => el.id));
    comm.subject = `${actionType} - ${uploadedDataset.title}`;
    comm.message_type = actionType;
    comm.message = message;
    comm.sent_status = CommunicationSentStatus.PENDING;
    comm.sent_date = null;
    comm.reference_entity_type = UploadedDataset.name;
    comm.reference_entity_name = uploadedDataset.id;
    comm.owner = userId;
    comm.updater = userId;
    try {
      //return await this.communicationLogService.send(comm);
      return await this.emailService.sendEmailWithRawFiles(
        toSend.map((el) => el.email),
        [],
        actionType,
        message,
        comm,
        files,
      );
    } catch (error) {
      console.error(error);
      this.logger.error('Error sending emails');
    }
  }

  /**
   * Save a corresponding action related to this updated dataset
   * @param actionType
   * @param actionDetails
   * @param dataset
   */
  async saveLog(
    actionType: string,
    actionDetails: string,
    dataset: UploadedDataset,
    userId: string,
  ) {
    const log = new UploadedDatasetLog();
    log.action_type = actionType;
    log.action_details = actionDetails;
    // log.action_date = new Date();
    log.action_taker = userId;
    log.uploaded_dataset = dataset;
    log.owner = userId;
    log.updater = userId;
    return await this.uploadedDataLogService.create(log, userId);
  }

  /**
   * Get dataset status that can allow modification
   * @returns
   */
  getModifiableStatus(): string[] {
    return [UploadedDatasetStatus['PENDING'].toString()];
  }

  /**
   * Parse a template replacing relevant variables
   * @param actionType
   * @returns
   */
  async makeMessage(
    dataset: UploadedDataset,
    actionType: UploadedDatasetActionTypeEnum,
    actionDetails: string,
  ): Promise<string> {
    let template = `<b>This is an email from Vector Atlas on ${actionType?.toString()}</b>`;
    switch (actionType) {
      case UploadedDatasetActionTypeEnum.NEW_UPLOAD:
        template = getNewUploadDataSetTemplate(dataset.title);
        break;
      case UploadedDatasetActionTypeEnum.APPROVE:
        template = getApproveDataSetTemplate(dataset.title);
        break;
      case UploadedDatasetActionTypeEnum.REVIEW:
        template = getReviewDataSetTemplate(dataset.id, actionDetails);
        break;
      case UploadedDatasetActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS:
        template = getAssignPrimaryReviewerTemplate(
          dataset.id,
          dataset.title,
          actionDetails,
        );
        break;
      case UploadedDatasetActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS:
        template = getAssignTertiaryReviewerTemplate(
          dataset.id,
          dataset.title,
          actionDetails,
        );
        break;
      case UploadedDatasetActionTypeEnum.REJECT_RAW:
        template = getRejectRawDataSetTemplate(dataset.title, actionDetails);
        break;
      case UploadedDatasetActionTypeEnum.REJECT_REVIEWED:
        template = getRejectReviewedDataSetTemplate(
          dataset.title,
          actionDetails,
        );
        break;
      case UploadedDatasetActionTypeEnum.REQUEST_REUPLOAD:
        template = getRequestReuploadDataSetTemplate(
          dataset.id,
          dataset.title,
          actionDetails,
        );
        break;
      default:
        break;
    }
    return template;
  }

  /**
   * Get list of all reviewers both primary and tertiary
   * @param dataset
   * @param includeAllReviewers. If true, it will include all users with review role. Else, will only return reviewers associated with the dataset
   * @returns
   */
  getReviewers = async (
    dataset: UploadedDataset,
    includeAllReviewers = false,
  ): Promise<string[]> => {
    const primary = dataset.primary_reviewers || [];
    const tertiary = dataset.tertiary_reviewers || [];
    let others = [];
    if (includeAllReviewers) {
      try {
        others = await this.authService.getRoles(Role.Reviewer); // await this.authService.getRoleEmails(Role.Reviewer);
      } catch (error) {
        this.logger.error(error);
        console.log(error);
      }
    }
    const all = primary
      .concat(tertiary)
      .concat(others.map((el: UserRole) => el.auth0_id));
    if (process.env.NODE_ENV == 'test') {
      all.push(process.env.EMAIL_FROM);
    }
    return [...new Set(all)];
  };

  getPrimaryReviewers = async (dataset: UploadedDataset): Promise<string[]> => {
    const primary = dataset.primary_reviewers || [];
    if (process.env.NODE_ENV == 'test') {
      primary.push(process.env.EMAIL_FROM);
    }
    return [...new Set(primary)];
  };

  getTertiaryReviewers = async (
    dataset: UploadedDataset,
  ): Promise<string[]> => {
    const tertiary = dataset.tertiary_reviewers || [];
    if (process.env.NODE_ENV == 'test') {
      tertiary.push(process.env.EMAIL_FROM);
    }
    return [...new Set(tertiary)];
  };

  /**
   * Get list of all reviewers both primary and tertiary
   * @param dataset
   * @returns
   */
  getReviewerManagers = async (): Promise<string[]> => {
    let others = [];
    try {
      others = await this.authService.getRoles(Role.ReviewerManager);
      // others = await this.authService.getRoleEmails(Role.ReviewerManager);
    } catch (error) {
      console.log(error);
    }
    const all = [].concat(others?.map((el) => el.auth0_id));
    if (process.env.NODE_ENV == 'test') {
      all.push(process.env.EMAIL_FROM);
    }
    return [...new Set(all)];
  };

  /**
   * Validate either an existing dataset or an adhoc one
   * @param datasetId
   * @param file
   * @returns
   */
  async validate(
    datasetId?: string,
    file?: Express.Multer.File,
    isApprovingContext = false,
  ) {
    const dataFile: any = null;
    let dataset: UploadedDataset = null;
    let destFile = '';
    const destFolder = process.env.TEMP_DIR;
    ensureDirectoryExists(destFolder);
    let error;
    if (!datasetId && !file) {
      error =
        'You must specify either dataset id or the file that is to be validated';
      // throw Error(
      //   error
      // );
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (datasetId) {
      // update status to approved
      dataset = await this.uploadedDataRepository.findOne({
        where: { id: datasetId },
      });
      if (!datasetId) {
        error = 'Dataset with the specified id does not exist';
        this.logger.error(error);
        //throw Error(error);
        return makeResponse({
          isError: true,
          error,
        });
      }
      if (
        dataset.status != UploadedDatasetStatus.PENDING_APPROVAL &&
        dataset.status != UploadedDatasetStatus.APPROVED
      ) {
        const error =
          'Dataset cannot be validated since it has not completed tertiary review';
        // throw Error(error );
        this.logger.error(error);
        return makeResponse({
          isError: true,
          error,
        });
      }

      destFile = await this.downloadToFileStorage(
        dataset.uploaded_file_name_tertiary_reviewed,
        destFolder,
      );
    } else {
      // we are doing adhoc validation
      const fileName = makeFileNameTimestamped(
        file.originalname,
        'adhoc-validation',
      );
      destFile = `${destFolder}/${fileName}`;
      await fs.writeFileSync(destFile, file.buffer);
    }
    const url = process.env.DATA_VALIDATION_URL;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(destFile));
    try {
      const res = await axios.post(url, formData, {});
      console.log('Validation validation results: ', res);
      // if (datasetId) {
      //   // Save dataset log
      //   const actionType: UploadedDatasetActionTypeEnum =
      //     UploadedDatasetActionTypeEnum.VALIDATE;
      //   await this.saveLog(
      //     actionType,
      //     UploadedDatasetActionTypeEnum.VALIDATE,
      //     dataset,
      //   );
      // }
      return isApprovingContext ? res : res.data;
    } catch (error) {
      console.error(error);
      this.logger.error('Validate POST error: ', error);
    }
  }

  /**
   * Ingest an uploaded dataset
   * @param datasetId
   * @returns
   */
  async ingest(datasetId: string) {
    // Run validate first
    const validationRes = await this.validate(datasetId, null, true);
    if (validationRes?.data.valid_data === true) {
      // validation was successful
    } else {
      return makeResponse({
        isError: !validationRes.data?.valid_data,
        data: validationRes.data,
        error: validationRes.data?.errors,
      });
    }

    let dataset: UploadedDataset = null;
    let destFile = '';
    const destFolder = process.env.TEMP_DIR;
    ensureDirectoryExists(destFolder);
    let error = '';
    // update status to approved
    dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    if (!datasetId) {
      error = 'Dataset with the specified id does not exist'; 
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (
      dataset.status != UploadedDatasetStatus.PENDING_APPROVAL &&
      dataset.status != UploadedDatasetStatus.APPROVED
    ) {
      error =
        'Dataset cannot be approved since it has not completed tertiary review'; 
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }

    destFile = await this.downloadToFileStorage(
      dataset.uploaded_file_name_tertiary_reviewed,
      process.env.TEMP_DIR,
    );
    let formData = new FormData();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    formData.append('file', fs.createReadStream(destFile));

    let ingestRes;
    if (validationRes.data?.valid_data) {
      const ingestUrl = process.env.DATA_INGESTION_URL;
      formData = new FormData();
      formData.append('file', fs.createReadStream(destFile));
      ingestRes = await axios.post(ingestUrl, formData, config);
      console.log('Ingestion res: ', ingestRes);
      return makeResponse({
        isError: !ingestRes.data?.valid_data,
        data: ingestRes.data,
        error: ingestRes.data?.errors,
      });
    }
    return makeResponse({
      isError: !validationRes.data?.valid_data,
      data: validationRes.data,
      error: validationRes.data?.errors,
    });
  }

  downloadFile = async (
    fileSource: string,
    destFolder: string,
  ): Promise<BlobDownloadResponseParsed | string | Readable> => {
    if (fileSource.startsWith('http')) {
      const fileName = fileSource.split('/').pop();
      const destFile = `${destFolder}/${fileName}`;
      return await this.azureBlobService.download(fileSource, destFile);
    } else {
      return fileSource;
    }
  };

  downloadToFileStorage = async (fileSource: string, destFolder: string) => {
    if (fileSource.startsWith('http')) {
      const fileName = fileSource.split('/').pop();
      const destFile = `${destFolder}/${fileName}`;
      await this.azureBlobService.downloadToLocalFile(
        fileName,
        TERTIARY_REVIEWED_CONTAINER,
        destFile,
      );
      return destFile;
    } else {
      return fileSource;
    }
  };

  getUserEmails = async (userIds: string[]) => {
    const emails = [];
    for (const userId of userIds) {
      emails.push(await this.getUserEmail(userId));
    }
    return emails;
  };

  getUserEmail = async (userId: string) => {
    if (userId.indexOf('@') != -1) {
      return userId;
    }
    await this.authService.init();
    return await this.authService.getEmailFromUserId(userId);
  };
}
