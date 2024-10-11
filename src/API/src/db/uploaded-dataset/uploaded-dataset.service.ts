import { Injectable, Logger } from '@nestjs/common';
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
  UploadedDatasetActionType,
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
} from '../../../templates/uploadedDataset';
import { getCurrentUser } from '../doi/util';
import { DOI } from '../doi/entities/doi.entity';
import { DoiService } from '../doi/doi.service';

@Injectable()
export class UploadedDatasetService {
  constructor(
    @InjectRepository(UploadedDataset)
    private uploadedDataRepository: Repository<UploadedDataset>,
    private communicationLogService: CommunicationLogService,
    private authService: AuthService,
    private uploadedDataLogService: UploadedDatasetLogService,
    private doiService: DoiService,
    private logger: Logger,
  ) {}

  async create(dataset: UploadedDataset) {
    const res = await this.uploadedDataRepository.save(dataset);
    // Save dataset log
    const actionType = UploadedDatasetActionType.NEW_UPLOAD;
    await this.saveLog(actionType, dataset.description || dataset.title, res);

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      dataset,
      actionType,
      'New dataset upload',
    );
    await this.communicate(res, actionType, [res.uploader_email], message);

    // notify all reviewers
    const recipients = await this.getReviewers(dataset, true);
    await this.communicate(dataset, actionType, recipients, message);
    return res;
  }

  async getUploadedDatasets() {
    return await this.uploadedDataRepository.find();
  }

  async getUploadedDatasetsByUploader(uploader: string) {
    return await this.uploadedDataRepository.find({
      where: { owner: uploader },
    });
  }

  async getUploadedDataset(id: string) {
    return await this.uploadedDataRepository.findOne({ where: { id } });
  }

  async update(id: string, uploadedDataset: UploadedDataset) {
    const toUpdate = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.getModifiableStatus().includes(uploadedDataset.status)) {
      throw new Error(
        `The dataset cannot be modified since it has ${uploadedDataset.status} status`,
      );
    }

    const updated = Object.assign(toUpdate, uploadedDataset);
    const res = await this.uploadedDataRepository.save(updated);

    // save dataset log
    const actionType = UploadedDatasetActionType.UPDATE;
    await this.saveLog(actionType, updated.description || updated.title, res);
    return res;
  }

  async reUploadDataset(id: string, uploadedDataset: UploadedDataset) {
    const toUpdate = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.getModifiableStatus().includes(uploadedDataset.status)) {
      throw new Error(
        `The dataset cannot be modified since it has ${uploadedDataset.status} status`,
      );
    }

    const updated = Object.assign(toUpdate, uploadedDataset);
    const res = await this.uploadedDataRepository.save(updated);

    // save dataset log
    const actionType = UploadedDatasetActionType.REUPLOAD;
    await this.saveLog(actionType, updated.description || updated.title, res);

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      updated,
      actionType,
      'Dataset re-upload',
    );
    this.communicate(res, actionType, [res.uploader_email], message);

    // notify only the assigned reviewers
    const recipients = await this.getReviewers(toUpdate, false);
    await this.communicate(updated, actionType, recipients, message);
    return res;
  }

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
  async approve(id: string, comment?: string) {
    let error = '';
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    if (!dataset.primary_reviewers) {
      error = 'There are no assigned primary reviewers for this dataset';
      this.logger.error(error);
      throw error;
    }
    if (!dataset.tertiary_reviewers) {
      error = 'There are no tertiary reviewers for this dataset';
      this.logger.error(error);
      throw error;
    }
    if (dataset.status == UploadedDatasetStatus.APPROVED) {
      error = 'Dataset is already approved';
      this.logger.error(error);
      throw error;
    }
    if (dataset.approved_by?.includes(getCurrentUser())) {
      return; // user has already approved
    }
    const now = new Date();
    dataset.status = UploadedDatasetStatus.APPROVED;
    dataset.last_status_update_date = now;
    dataset.approved_by = dataset.approved_by.concat(getCurrentUser());
    dataset.approved_on = now;
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.APPROVE;
    await this.saveLog(actionType, comment || 'Dataset approved', dataset);

    // notify all + assigned reviewers
    // @TODO: Modify unit test to reflect sending emails to all reviewers
    const recipients = await this.getReviewers(dataset, true);
    const message = await this.makeMessage(dataset, actionType);
    await this.communicate(dataset, actionType, recipients, message);

    // mint DOI if it was requested
    if (dataset.is_doi_requested) {
      // await this.doiService.generateDOI()
      const doi = new DOI();
      doi.approval_status = ApprovalStatus.PENDING;
      doi.creator_email = dataset.uploader_email;
      doi.creator_name = dataset.uploader_name;
      doi.publication_year = new Date().getFullYear();
      doi.source_type = DOISourceType.UPLOAD;
      doi.title = dataset.title;
      doi.description = dataset.description;
      await this.doiService.upsert(doi);
      const doiRes = await this.doiService.generateDOI(doi);

      if (doiRes) {
        // Save dataset log
        await this.saveLog(
          UploadedDatasetActionType.GENERATE_DOI,
          'Generate DOI',
          dataset,
        );

        // notify assigned reviewers
        const reviewers = await this.getReviewers(dataset, false);
        let doiMessage = await this.makeMessage(
          dataset,
          UploadedDatasetActionType.GENERATE_DOI,
        );
        // send email to reviewers
        await this.communicate(
          dataset,
          UploadedDatasetActionType.GENERATE_DOI,
          reviewers,
          doiMessage,
        );

        // notify uploader
        const uploader_email = [dataset.uploader_email?.trim()];
        doiMessage = await this.makeMessage(
          dataset,
          UploadedDatasetActionType.GENERATE_DOI,
        );

        // send email to uploader
        await this.communicate(
          dataset,
          UploadedDatasetActionType.GENERATE_DOI,
          uploader_email,
          doiMessage,
        );
      }
    }
    return res;
  }

  /**
   * Review an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param id
   */
  async review(datasetId: string, reviewComment?: string) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    // No updating status in a review
    // dataset.status = UploadedDatasetStatus.APPROVED;
    // dataset.last_status_update_date = new Date();
    // const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.REVIEW;
    const res = await this.saveLog(
      actionType,
      reviewComment || 'Dataset reviewed',
      dataset,
    );
    // notify assigned reviewers
    const recipients = await this.getReviewers(dataset, false);
    const message = await this.makeMessage(dataset, actionType, reviewComment);
    await this.communicate(dataset, actionType, recipients, message);
    return res;
  }

  /**
   * Assign primary reviewer(s) to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param primaryReviewers
   * @param comment
   * @returns
   */
  async assignPrimaryReviewer(
    datasetId: string,
    primaryReviewers: string | string[],
    comment?: string,
  ) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    const reviewers = (dataset.primary_reviewers || []).concat(
      primaryReviewers,
    );
    const finalReviewers = [...new Set(reviewers)];
    dataset.status = UploadedDatasetStatus.PRIMARY_REVIEW;
    dataset.primary_reviewers = finalReviewers;
    dataset.last_status_update_date = new Date();
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.ASSIGN_PRIMARY_REVIEW;
    await this.saveLog(
      actionType,
      comment || 'Assign Primary Reviewers',
      dataset,
    );

    // notify assigned reviewers
    if (dataset.primary_reviewers) {
      const recipients = dataset.primary_reviewers;
      const message = await this.makeMessage(dataset, actionType, comment);
      await this.communicate(dataset, actionType, recipients, message);
    }
    return res;
  }

  /**
   * Assign primary reviewer(s) to an uploaded dataset. Creates an UploadedDatasetLog and also sends an email to assigned_reviewer
   * @param datasetId
   * @param primaryReviewers
   * @param comment
   * @returns
   */
  async assignTertiaryReviewer(
    datasetId: string,
    tertiaryReviewers: string | string[],
    comment?: string,
  ) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id: datasetId },
    });
    const reviewers = (dataset.tertiary_reviewers || []).concat(
      tertiaryReviewers,
    );
    const finalReviewers = [...new Set(reviewers)];
    dataset.status = UploadedDatasetStatus.TERTIARY_REVIEW;
    dataset.tertiary_reviewers = finalReviewers;
    dataset.last_status_update_date = new Date();
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.ASSIGN_TERTIARY_REVIEW;
    await this.saveLog(
      actionType,
      comment || 'Assign Tertiary Reviewers',
      dataset,
    );

    // notify assigned reviewers
    if (dataset.tertiary_reviewers) {
      const recipients = dataset.tertiary_reviewers;
      const message = await this.makeMessage(dataset, actionType, comment);
      await this.communicate(dataset, actionType, recipients, message);
    }
    return res;
  }

  /**
   * Reject an uploaded dataset that has just been uploaded by a public user
   * @param id
   */
  async rejectRawDataset(id: string, comment?: string) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    dataset.status = UploadedDatasetStatus.REJECTED;
    dataset.last_status_update_date = new Date();
    const res = await this.uploadedDataRepository.save(dataset);

    //Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.REJECT_RAW;
    await this.saveLog(actionType, comment || 'Raw Dataset rejected', dataset);

    // Notify uploader
    const recipients = dataset.uploader_email?.split(',');
    const message = await this.makeMessage(dataset, actionType);
    await this.communicate(dataset, actionType, recipients, message);
    return res;
  }

  /**
   * Reject an uploaded dataset that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async rejectReviewedDataset(id: string, comment?: string) {
    // update status to rejected
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    dataset.status = UploadedDatasetStatus.REJECTED_BY_MANAGER;
    dataset.last_status_update_date = new Date();
    const res = await this.uploadedDataRepository.save(dataset);

    // save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.REJECT_REVIEWED;
    await this.saveLog(
      actionType,
      comment || 'Reviewed Dataset rejected',
      dataset,
    );

    // notify assigned reviewers
    const recipients = await this.getReviewers(dataset, false);
    if (recipients) {
      const message = await this.makeMessage(dataset, actionType);
      await this.communicate(dataset, actionType, recipients, message);
    } else {
      this.logger.error('This dataset does not have an assigned reviewer');
      throw 'This dataset does not have an assigned reviewer';
    }
    return res;
  }

  /**
   * Make a communication against the uploaded dataset
   * @param id
   */
  async communicate(
    uploadedDataset: UploadedDataset,
    actionType: UploadedDatasetActionType,
    recipient_emails: string[],
    message: string,
  ) {
    // create a communication log
    const comm = new CommunicationLog();
    comm.channel_type = CommunicationChannelType.EMAIL;
    comm.recipients = recipient_emails.join(',');
    comm.message_type = actionType;
    comm.message = message;
    comm.sent_status = CommunicationSentStatus.PENDING;
    comm.sent_date = null;
    comm.reference_entity_type = UploadedDataset.name;
    comm.reference_entity_name = uploadedDataset.id;
    return await this.communicationLogService.send(comm);
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
  ) {
    const log = new UploadedDatasetLog();
    log.action_type = actionType;
    log.action_details = actionDetails;
    log.action_date = new Date();
    log.action_taker = getCurrentUser();
    log.dataset = dataset;
    return await this.uploadedDataLogService.create(log);
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
    actionType: UploadedDatasetActionType,
    actionDetails = '',
  ): Promise<string> {
    let template = `<b>This is an email from Vector Atlas on ${actionType?.toString()}</b>`;
    switch (actionType) {
      case UploadedDatasetActionType.NEW_UPLOAD:
        template = getNewUploadDataSetTemplate(dataset.title);
        break;
      case UploadedDatasetActionType.APPROVE:
        template = getApproveDataSetTemplate(dataset.title);
        break;
      case UploadedDatasetActionType.REVIEW:
        template = getReviewDataSetTemplate(
          dataset.id,
          getCurrentUser(),
          actionDetails,
        );
        break;
      case UploadedDatasetActionType.ASSIGN_PRIMARY_REVIEW:
        template = getAssignPrimaryReviewerTemplate(
          dataset.title,
          actionDetails,
        );
        break;
      case UploadedDatasetActionType.ASSIGN_TERTIARY_REVIEW:
        template = getAssignTertiaryReviewerTemplate(
          dataset.title,
          actionDetails,
        );
        break;
      case UploadedDatasetActionType.REJECT_RAW:
        template = getRejectRawDataSetTemplate(dataset.title, actionDetails);
        break;
      case UploadedDatasetActionType.REJECT_REVIEWED:
        template = getRejectReviewedDataSetTemplate(
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
        others = await this.authService.getRoleEmails('reviewer');
      } catch (error) {
        console.log(error);
      }
    }
    const all = primary.concat(tertiary).concat(others);
    all.push(process.env.EMAIL_FROM);
    return [...new Set(all)];
  };
}
