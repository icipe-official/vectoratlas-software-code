import { Injectable } from '@nestjs/common';
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
    this.communicate(res, actionType, [res.uploader_email], message);

    // notify all reviewers
    const recipients = await this.getReviewers();
    await this.communicate(dataset, actionType, recipients, message);
    return res;
  }

  async getUploadedDatasets() {
    return this.uploadedDataRepository.find();
  }

  async getUploadedDataset(id: string) {
    return this.uploadedDataRepository.findOne({ where: { id } });
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
    const recipients = updated.assigned_reviewers?.split(',');
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
  async approve(id: string) {
    // update status to approved
    const dataset = await this.uploadedDataRepository.findOne({
      where: { id },
    });
    dataset.status = UploadedDatasetStatus.APPROVED;
    dataset.last_status_update_date = new Date();
    const res = await this.uploadedDataRepository.save(dataset);

    // Save dataset log
    const actionType: UploadedDatasetActionType =
      UploadedDatasetActionType.APPROVE;
    await this.saveLog(actionType, 'Dataset approved', dataset);

    // notify assigned reviewers
    const recipients = dataset.assigned_reviewers?.split(',');
    const message = await this.makeMessage(dataset, actionType);
    await this.communicate(dataset, actionType, recipients, message);

    // generate DOI
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
      const reviewers = dataset.assigned_reviewers?.split(',');
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
    return res;
  }

  /**
   * Reject an uploaded dataset that has just been uploaded by a public user
   * @param id
   */
  async rejectRawDataset(id: string) {
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
    await this.saveLog(actionType, 'Dataset rejected', dataset);

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
  async rejectReviewedDataset(id: string) {
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
    await this.saveLog(actionType, 'Dataset rejected', dataset);

    // notify assigned reviewers
    const recipients = dataset.assigned_reviewers?.split(',');
    if (recipients) {
      const message = await this.makeMessage(dataset, actionType);
      await this.communicate(dataset, actionType, recipients, message);
    } else {
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
   * Get emails of reviewers
   * @returns
   */
  async getReviewers() {
    const emailAddress = 'stevenyaga@gmail.com';
    const emailList = await this.authService.getRoleEmails('reviewer');
    emailList.push(emailAddress);
    return emailList;
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
}
