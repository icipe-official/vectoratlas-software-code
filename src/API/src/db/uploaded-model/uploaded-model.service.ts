import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JsonContains, Repository, DataSource } from 'typeorm';
import config from '../../config/config';
import { DoiService } from '../doi/doi.service';
import {
  ApprovalStatus,
  CommunicationChannelType,
  CommunicationSentStatus,
  DOISourceType,
  UploadedModelActionTypeEnum,
  UploadedModelStatus,
} from '../../../src/commonTypes';
import {
  deleteFile,
  ensureDirectoryExists,
  extractFileNameFromBlobUrl,
  makeFileNameTimestamped,
  makeResponse,
  readFileContent,
  writeFileContent,
} from 'src/utils';
import { DOI } from '../doi/entities/doi.entity';
import { Role } from 'src/auth/user_role/role.enum';
import { UserRole } from 'src/auth/user_role/user_role.entity';
import { UploadedModelLog } from '../uploaded-model-log/entities/uploaded-model-log.entity';
import axios from 'axios';
import * as fs from 'fs';
import { UploadedModel } from './entities/uploaded-model.entity';
import {
  getApproveModelTemplate,
  getNewUploadModelTemplate,
  getRejectModelTemplate,
  getRejectRawModelTemplate,
  getRejectReviewedModelTemplate,
  getRequestReuploadModelTemplate,
  getReviewModelTemplate,
} from 'templates/uploadedModelDataset';
import {
  getAssignPrimaryReviewerTemplate,
  getAssignTertiaryReviewerTemplate,
  getReAssignTertiaryReviewerTemplate,
} from 'templates/uploadedDataset';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { BlobDownloadResponseParsed } from '@azure/storage-blob';
import { Readable } from 'stream';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import {
  AzureBlobService,
  AzureBlobUploadResponse,
} from '../azure-blob/azure-blob.service';
import { DatasetService } from '../shared/dataset.service';
import { UploadedModelLogService } from '../uploaded-model-log/uploaded-model-log.service';

const RAW_MODEL_CONTAINER = 'models';
const APPROVED_MODEL_CONTAINER = 'models';
const FILE_STORAGE_TYPE = process.env.FILE_STORAGE_TYPE; // one of AZURE or LOCAL

@Injectable()
export class UploadedModelService {
  constructor(
    @InjectRepository(UploadedModel)
    private modelRepository: Repository<UploadedModel>,
    private authService: AuthService,
    private uploadedModelLogService: UploadedModelLogService,
    private logger: Logger,
    private emailService: EmailService,
    private azureBlobService: AzureBlobService,
    private datasetService: DatasetService,
    @Inject(forwardRef(() => DoiService))
    private readonly doiService: DoiService,
    private dataSource: DataSource, // Calling in Constructor
  ) {}

  async getUploadedModels() {
    return await this.modelRepository.find({
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUploadedModelsByUploader(uploader: string) {
    return await this.modelRepository.find({
      where: { owner: uploader },
      order: {
        modified: 'DESC',
      },
    });
  }

  async getUploadedModel(id: string, withRelations = true) {
    let res = undefined;
    if (withRelations) {
      res = await this.modelRepository.find({
        where: { id: id },
        relations: ['uploaded_model_log', 'doi'],
        order: {
          modified: 'DESC',
        },
      });
    } else {
      res = await this.modelRepository.find({
        where: { id: id },
      });
    }
    return res?.length > 0 ? res[0] : undefined;
  }

  async validateUser(id: string, userId: string) {
    return await this.modelRepository.findOne({
      where: { id, owner: userId },
    });
  }

  async update(id: string, model: UploadedModel, userId: string) {
    const toUpdate = await this.modelRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.getModifiableStatus().includes(model.status)) {
      const error = `The model cannot be modified since it has ${model.status} status`;
      // throw new Error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }

    const updated = Object.assign(toUpdate, model);
    updated.updater = userId;
    const res = await this.modelRepository.save(updated);

    // save model log
    const actionType = UploadedModelActionTypeEnum.UPDATE;
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
    const model = await this.getUploadedModel(datasetId);
    const { containerName, fileName } = this.getContainerName(model);
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
  getContainerName = (model: UploadedModel) => {
    const datasetStatus = model.status;
    let containerName = RAW_MODEL_CONTAINER;
    let fileName = model.uploaded_file_name;
    if (
      datasetStatus == UploadedModelStatus.PENDING ||
      datasetStatus == UploadedModelStatus.REJECTED
    ) {
      containerName = RAW_MODEL_CONTAINER;
      fileName = model.uploaded_file_name;
    }
    // if (datasetStatus == UploadedModelStatus.PRIMARY_REVIEW) {
    //   containerName = PRIMARY_REVIEWED_CONTAINER;
    //   fileName = model.uploaded_file_name_primary_reviewed;
    // }
    if (
      // datasetStatus == UploadedModelStatus.TERTIARY_REVIEW ||
      // datasetStatus == UploadedModelStatus.PENDING_APPROVAL ||
      datasetStatus == UploadedModelStatus.APPROVED
      // || datasetStatus == UploadedModelStatus.REJECTED_BY_MANAGER
    ) {
      containerName = APPROVED_MODEL_CONTAINER;
      fileName = model.uploaded_file_name; // .uploaded_file_name_tertiary_reviewed;
    }
    return { containerName, fileName };
  };

  /**
   * Internal method to upload file to blob
   * @param file
   * @param directory
   * @returns
   */
  _doUpload = async (
    file: Express.Multer.File,
    directory: string,
  ): Promise<AzureBlobUploadResponse | string> => {
    if (FILE_STORAGE_TYPE === 'Azure') {
      const resp = await this.azureBlobService.upload(file, directory);
      return resp;
    } else {
      return file.path;
    }
  };

  /**
   * Upload for the first time
   * @param model
   * @param file
   * @returns
   */
  async firstUpload(
    model: UploadedModel,
    file: Express.Multer.File,
    userId: string,
  ): Promise<AzureBlobUploadResponse | string> {
    // this.authService.init();
    // const user = await this.authService.getUserDetailsFromId(userId);
    const uploadResp: AzureBlobUploadResponse | string = await this._doUpload(
      file,
      RAW_MODEL_CONTAINER,
    );
    // model.uploader_name = user?.name;
    model.uploaded_file_name =
      typeof uploadResp === 'string' ? uploadResp : uploadResp.uploadedFileUrl; // set uploaded file url
    model.last_upload_date = new Date();
    model.last_status_update_date = new Date();
    model.status = UploadedModelStatus.PENDING;
    model.uploader = userId;
    model.owner = userId;
    const res = await this.modelRepository.save(model);
    // Save model log
    const actionType = UploadedModelActionTypeEnum.NEW_UPLOAD;
    await this.saveLog(
      actionType,
      model.description || model.title,
      res,
      userId,
    );

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      model,
      actionType,
      'New model upload',
    );
    // const uploader_email = await this.getUserEmail(userId);
    await this.communicate(res, actionType, [userId], message, userId);

    // notify all reviewers
    const recipients = await this.getApprovers(model, true);
    await this.communicate(model, actionType, recipients, message, userId);
    return uploadResp;
  }

  allowReupload = (model: UploadedModel) => {
    return (
      model.status == UploadedModelStatus.PENDING &&
      model.is_reupload_requested &&
      !model.is_reuploaded
    );
  };

  /**
   * Delete a model
   *
   * 1. Delete entry in the uploaded-model table
   * 2. Delete entry in map_styles.json
   * 3. Delete .mbtiles file
   * 4. Delete actual .tif file
   * @param id
   * @returns
   */
  async remove(id: string) {
    const model = await this.modelRepository.findOne({
      where: { id },
    });

    const modelDisplayName = model.title.trim().replace(/\s/g, '_');

    //1. Remove the DOI
    await this.doiService.removeByModel(id);
    //Remove the logs
    await this.uploadedModelLogService.removeByModel(id);

    //2. Delete model from the db
    await this.modelRepository.delete(id);

    //3. delete .mbtiles file
    const mbTilesPath = config.get('tileServerDataFolder') + '/overlays/';
    const tilesFile = `${mbTilesPath}${modelDisplayName}.mbtiles`;
    deleteFile(tilesFile);

    //4. modify config.json by deleting the model key
    const configPath = config.get('tileServerDataFolder') + '/config.json';
    const configContents = readFileContent(configPath);
    const configJson = JSON.parse(configContents);

    // delete the key
    delete configJson['data'][modelDisplayName];
    // Write the modified entry
    writeFileContent(configPath, JSON.stringify(configJson, null, 2));

    //5. Delete map_styles.json entry
    const stylePath = config.get('configFolder') + '/map_styles.json';
    const styleContents = readFileContent(stylePath);
    const styleJson = JSON.parse(styleContents);

    // filter out layers
    const layers = styleJson['layers'].filter(
      (el) => el.name !== modelDisplayName,
    );
    const finalStyleJson = { scales: styleJson['scales'], layers };
    // Write the modified entry
    writeFileContent(stylePath, JSON.stringify(finalStyleJson, null, 2));

    //6. Delete map_overlays.json entry
    const overlaysPath = config.get('configFolder') + '/map_overlays.json';
    const overlaysContents = readFileContent(overlaysPath);
    const overlaysJson = JSON.parse(overlaysContents);

    // filter out layers
    const modelOverlay = overlaysJson.find(
      (el) => el.name === modelDisplayName,
    );

    const overlays = overlaysJson.filter((el) => el.name !== modelDisplayName);
    // Write the modified entry
    writeFileContent(overlaysPath, JSON.stringify(overlays, null, 2));

    //7. Delete local .tif
    if (modelOverlay) {
      const blobLocation = modelOverlay['blobLocation'];

      if (blobLocation.startsWith('http')) {
        const blobFile = extractFileNameFromBlobUrl(blobLocation);
        await this.azureBlobService.deleteFile(
          blobFile,
          APPROVED_MODEL_CONTAINER,
        );
      } else {
        deleteFile(blobLocation);
      }
    }

    // 8. delete uploaded .tif if blobLocation is different from model.uploaded_file_name
    if (model.uploaded_file_name.startsWith('http')) {
      const blobFile = extractFileNameFromBlobUrl(model.uploaded_file_name);
      try {
        await this.azureBlobService.deleteFile(
          blobFile,
          APPROVED_MODEL_CONTAINER,
        );
      } catch (error) {}
    } else {
      deleteFile(model.uploaded_file_name);
    }
  }

  /**
   * Approve an uploaded model. Creates an UploadedModelLog and also sends an email to reviewer
   * @param id
   */
  async approve(id: string, comments: string, userId: string) {
    let error = '';
    // update status to approved
    const model = await this.modelRepository.findOne({
      where: { id },
    });
    // if (!model.primary_reviewers) {
    //   error = 'There are no assigned primary reviewers for this model';
    //   this.logger.error(error);
    //   return makeResponse({
    //     isError: true,
    //     error,
    //   });
    // }
    // if (!model.tertiary_reviewers) {
    //   error = 'There are no tertiary reviewers for this model';
    //   this.logger.error(error);
    //   return makeResponse({
    //     isError: true,
    //     error,
    //   });
    // }
    if (model.status == UploadedModelStatus.APPROVED) {
      error = 'Uploaded model is already approved';
      this.logger.error(error);
      return makeResponse({
        isError: true,
        error,
      });
    }
    if (model.approved_by?.includes(userId)) {
      // user has already approved
      this.logger.error('User has already approved this model');
      return makeResponse({
        isError: true,
        error: 'User has already approved this model',
      });
    }

    // // validate that it will not lead to duplicate datasets
    // const ds = await this.datasetService.getDatasetByUploadedDatasetId(
    //   model.id,
    // );
    // if (ds) {
    //   this.logger.error(
    //     'This model has already been ingested: ' + model.title,
    //   );
    //   return makeResponse({
    //     isError: true,
    //     error: 'This model has already been ingested',
    //   });
    // }

    // // ingest data first
    // const ingestRes = await this.ingest(id);
    // if (!ingestRes.success) {
    //   //   'uploaded model contains errors. Please go to validate model menu to view error details',
    //   // );
    //   this.logger.error(
    //     'uploaded model contains errors. Please go to validate model menu to view error details',
    //   );
    //   return makeResponse({
    //     isError: true,
    //     data: ingestRes.data,
    //     error:
    //       'uploaded model contains errors. Please go to validate model menu to view error details',
    //   });
    // }

    // // update model with the uploaded model id that generated it
    // await this.datasetService.updateUploadedDatasetId(
    //   ingestRes.data['dataset_id'],
    //   model,
    // );

    const now = new Date();
    model.status = UploadedModelStatus.APPROVED;
    model.last_status_update_date = now;
    model.approved_by = (model.approved_by || []).concat(userId);
    model.approved_on = now;
    model.updater = userId;
    const res = await this.modelRepository.save(model);

    // Save model log
    const actionType: UploadedModelActionTypeEnum =
      UploadedModelActionTypeEnum.APPROVE;
    await this.saveLog(
      actionType,
      comments || 'Uploaded model approved',
      model,
      userId,
    );

    // mint DOI if it was requested
    if (model.is_doi_requested) {
      let doi = new DOI();
      const exists = await this.doiService.getDOIByUploadedModel(model.id);
      if (exists !== undefined) {
        doi = exists;
      }
      doi.approval_status = ApprovalStatus.PENDING;
      doi.creator = model.uploader;
      // doi.creator_email = await this.getUserEmail(model.owner)// model.uploader_email;
      // doi.creator_name = model.uploader_name;
      doi.publication_year = new Date().getFullYear();
      doi.source_type = DOISourceType.MODEL_UPLOAD;
      doi.title = model.title;
      doi.description = model.description;
      doi.meta_data = { filters: {}, fields: [] };
      doi.uploaded_model = model;
      doi.owner = userId;
      doi.updater = userId;
      await this.doiService.upsert(doi);

      //const doiRes = await this.doiService.generateDOI(doi);
      // const uploader_email = model.owner
      //   ? await this.getUserEmail(model.owner)
      //   : null; // model.uploader_email?.trim();

      const reviewers = []; //await this.getReviewers(model, false);
      let recipients = model.owner
        ? [...reviewers, model.owner]
        : [...reviewers];
      recipients = [...new Set(recipients)];
      const doiRes = await this.doiService.approveDOI(
        doi.id,
        userId,
        comments,
        recipients,
      );

      if (doiRes) {
        // Save model log
        await this.saveLog(
          UploadedModelActionTypeEnum.GENERATE_DOI,
          'Generate DOI',
          model,
          userId,
        );

        // notify assigned reviewers
        const doiMessage = await this.makeMessage(
          model,
          UploadedModelActionTypeEnum.GENERATE_DOI,
          '',
        );

        // send email to reviewers
        // await this.communicate(
        //   model,
        //   UploadedModelActionTypeEnum.GENERATE_DOI,
        //   reviewers,
        //   doiMessage,
        // );

        // notify uploader
        await this.communicate(
          model,
          UploadedModelActionTypeEnum.GENERATE_DOI,
          model.owner,
          doiMessage,
          userId,
        );
      }
    }

    // notify all + assigned reviewers
    // @TODO: Modify unit test to reflect sending emails to all reviewers
    const recipients = await this.getApprovers(null, true);
    //const approvers = await this.getApprovers(null, true); // this.getReviewerManagers();
    //recipients = (recipients || []).concat(approvers || []);
    const message = await this.makeMessage(model, actionType, '');
    await this.communicate(model, actionType, recipients, message, userId);

    return res;
  }

  /**
   * Review an uploaded model. Creates an UploadedModelLog and also sends an email to assigned_reviewer
   * @param id
   */
  async review(datasetId: string, reviewComment: string, userId: string) {
    // update status to approved
    const model = await this.modelRepository.findOne({
      where: { id: datasetId },
    });
    // No updating status in a review
    // model.status = UploadedModelStatus.APPROVED;
    // model.last_status_update_date = new Date();
    // const res = await this.modelRepository.save(model);

    // Save model log
    const actionType: UploadedModelActionTypeEnum =
      UploadedModelActionTypeEnum.REVIEW;
    const res = await this.saveLog(
      actionType,
      reviewComment || 'Uploaded model reviewed',
      model,
      userId,
    );
    // notify assigned reviewers
    const recipients = await this.getReviewers(model, false);
    const message = await this.makeMessage(model, actionType, reviewComment);
    await this.communicate(model, actionType, recipients, message, userId);
    return res;
  }

  // /**
  //  * Assign primary reviewer(s) to an uploaded model. Creates an UploadedModelLog and also sends an email to assigned_reviewer
  //  * @param datasetId
  //  * @param primaryReviewers
  //  * @param comments
  //  * @returns
  //  */
  // async assignPrimaryReviewer(
  //   datasetId: string,
  //   primaryReviewers: string | string[],
  //   comments: string,
  //   userId: string,
  // ) {
  //   if (typeof primaryReviewers === 'string') {
  //     primaryReviewers = [primaryReviewers];
  //   }
  //   // update status to approved
  //   const model = await this.modelRepository.findOne({
  //     where: { id: datasetId },
  //   });
  //   const reviewers = (model.primary_reviewers || []).concat(primaryReviewers);
  //   const finalReviewers = [...new Set(reviewers)];
  //   model.status = UploadedModelStatus.PRIMARY_REVIEW;
  //   model.primary_reviewers = [].concat(primaryReviewers);
  //   model.last_status_update_date = new Date();
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   // Save model log
  //   const actionType: UploadedModelActionTypeEnum =
  //     UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS;
  //   await this.saveLog(
  //     actionType,
  //     comments || 'Assign Primary Reviewers',
  //     model,
  //     userId,
  //   );

  //   // notify assigned primary reviewers
  //   if (finalReviewers) {
  //     const recipients = await this.getPrimaryReviewers(model); // finalReviewers;
  //     const message = await this.makeMessage(model, actionType, comments);
  //     await this.communicate(model, actionType, recipients, message, userId);
  //   }
  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // /**
  //  * Complete primary review to an uploaded model. Creates an UploadedModelLog and also sends an email to assigned_reviewer
  //  * @param datasetId
  //  * @param uploaded_file_name
  //  * @param comments
  //  * @param otherRecipients
  //  * @returns
  //  */
  // // @UseInterceptors(FileInterceptor('file'))
  // async completePrimaryReview(
  //   datasetId: string,
  //   // uploaded_file_name: string,
  //   file: Express.Multer.File,
  //   comments: string,
  //   // otherRecipients?: [string],
  //   userId: string,
  // ) {
  //   // update status to approved
  //   const model = await this.modelRepository.findOne({
  //     where: { id: datasetId },
  //   });

  //   const reviewerManagers = await this.getReviewerManagers();
  //   const primaryReviewers = await this.getPrimaryReviewers(model);

  //   const recipients = (primaryReviewers || []).concat(reviewerManagers);

  //   const uploadedUrl = await this._doUpload(file, PRIMARY_REVIEWED_CONTAINER); //upload file
  //   model.status = UploadedModelStatus.PENDING_ASSIGNING_TERTIARY_REVIEW;
  //   model.last_status_update_date = new Date();
  //   model.uploaded_file_name_primary_reviewed = uploadedUrl; //update uploaded file url
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   // Save model log
  //   const actionType: UploadedModelActionTypeEnum =
  //     UploadedModelActionTypeEnum.COMPLETE_PRIMARY_REVIEW;
  //   await this.saveLog(
  //     actionType,
  //     comments || 'Complete Primary Review',
  //     model,
  //     userId,
  //   );

  //   // notify assigned reviewers and other reviewers
  //   const message = await this.makeMessage(model, actionType, comments);
  //   await this.communicate(model, actionType, recipients, message, userId);
  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // /**
  //  * Complete tertiary review to an uploaded model. Creates an UploadedModelLog and also sends an email to assigned_reviewer
  //  * @param datasetId
  //  * @param uploaded_file_name
  //  * @param comments
  //  * @param otherRecipients
  //  * @returns
  //  */
  // async completeTertiaryReview(
  //   datasetId: string,
  //   // uploaded_file_name: string,
  //   file: Express.Multer.File,
  //   comments: string,
  //   userId: string,
  // ) {
  //   // update status to approved
  //   const model = await this.modelRepository.findOne({
  //     where: { id: datasetId },
  //   });
  //   const reviewers = await this.getReviewers(model, true);

  //   const uploadedUrl = await this._doUpload(file, TERTIARY_REVIEWED_CONTAINER); //upload file
  //   model.status = UploadedModelStatus.PENDING_APPROVAL;
  //   model.last_status_update_date = new Date();
  //   model.uploaded_file_name_tertiary_reviewed = uploadedUrl; // update uploaded file url
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   // Save model log
  //   const actionType: UploadedModelActionTypeEnum =
  //     UploadedModelActionTypeEnum.COMPLETE_TERTIARY_REVIEW;
  //   await this.saveLog(
  //     actionType,
  //     comments || 'Complete Tertiary Review',
  //     model,
  //     userId,
  //   );

  //   // notify assigned reviewers and other recipients
  //   const recipients = reviewers;
  //   const message = await this.makeMessage(model, actionType, comments);
  //   await this.communicate(model, actionType, recipients, message, userId);
  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // /**
  //  * Assign primary reviewer(s) to an uploaded model. Creates an UploadedModelLog and also sends an email to assigned_reviewer
  //  * @param datasetId
  //  * @param primaryReviewers
  //  * @param comments
  //  * @returns
  //  */
  // async assignTertiaryReviewer(
  //   datasetId: string,
  //   tertiaryReviewers: string | string[],
  //   comments: string,
  //   isReassignment = false,
  //   userId: string,
  // ) {
  //   if (typeof tertiaryReviewers === 'string') {
  //     tertiaryReviewers = [tertiaryReviewers];
  //   }
  //   // update status to approved
  //   const model = await this.modelRepository.findOne({
  //     where: { id: datasetId },
  //   });
  //   let reviewers = (model.tertiary_reviewers || []).concat(tertiaryReviewers);

  //   if (isReassignment) {
  //     // reset the reassigned_tertiary_reviewers
  //     reviewers = [...tertiaryReviewers];
  //   }

  //   const finalReviewers = [...new Set(reviewers)];
  //   model.status = UploadedModelStatus.TERTIARY_REVIEW;
  //   if (isReassignment) {
  //     model.is_tertiary_review_reassigned = true;
  //     model.reassigned_tertiary_reviewers = finalReviewers;
  //   } else {
  //     model.is_tertiary_review_reassigned = false;
  //     model.tertiary_reviewers = finalReviewers;
  //   }
  //   model.last_status_update_date = new Date();
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   // Save model log
  //   const actionType: UploadedModelActionTypeEnum = isReassignment
  //     ? UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS
  //     : UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS;
  //   await this.saveLog(
  //     actionType,
  //     comments ||
  //       (isReassignment
  //         ? 'Reassign Tertiary Reviewers'
  //         : 'Assign Tertiary Reviewers'),
  //     model,
  //     userId,
  //   );

  //   // notify only the newly assigned reviewers
  //   if (tertiaryReviewers.length > 0) {
  //     const message = await this.makeMessage(model, actionType, comments);
  //     await this.communicate(
  //       model,
  //       actionType,
  //       tertiaryReviewers,
  //       message,
  //       userId,
  //     );
  //   }
  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // /**
  //  * Reject an uploaded model that has just been uploaded by a public user
  //  * @param id
  //  */
  // async rejectRawDataset(id: string, comments: string, userId: string) {
  //   // update status to rejected
  //   const model = await this.modelRepository.findOne({
  //     where: { id },
  //   });
  //   model.status = UploadedModelStatus.REJECTED;
  //   model.last_status_update_date = new Date();
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   //Save model log
  //   const actionType: UploadedModelActionTypeEnum =
  //     UploadedModelActionTypeEnum.REJECT_RAW;
  //   await this.saveLog(
  //     actionType,
  //     comments || 'Reject UploadedModel',
  //     model,
  //     userId,
  //   );

  //   // Notify uploader + reviewers + reviewe managers
  //   const reviewers = await this.getReviewers(model, false);
  //   const recipients = (reviewers || []).concat(model.owner);
  //   const message = await this.makeMessage(model, actionType, comments);
  //   await this.communicate(model, actionType, recipients, message, userId);

  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // /**
  //  * Reject an uploaded model that has already been reviewed and formatted
  //  * into VA template by a reviewer
  //  * @param id
  //  */
  // async rejectReviewedDataset(id: string, comments: string, userId: string) {
  //   // update status to rejected
  //   const model = await this.modelRepository.findOne({
  //     where: { id },
  //   });
  //   model.status = UploadedModelStatus.REJECTED_BY_MANAGER;
  //   model.last_status_update_date = new Date();
  //   model.updater = userId;
  //   const res = await this.modelRepository.save(model);

  //   // save model log
  //   const actionType: UploadedModelActionTypeEnum =
  //     UploadedModelActionTypeEnum.REJECT_REVIEWED;
  //   await this.saveLog(
  //     actionType,
  //     comments || 'Reviewed uploaded model rejected',
  //     model,
  //     userId,
  //   );

  //   // notify assigned reviewers
  //   const recipients = await this.getReviewers(model, false);
  //   if (recipients.length > 0) {
  //     const message = await this.makeMessage(model, actionType, comments);
  //     await this.communicate(model, actionType, recipients, message, userId);
  //   } else {
  //     const error = 'This model does not have an assigned reviewer';
  //     this.logger.error(error);
  //     return makeResponse({
  //       isError: true,
  //       error,
  //     });
  //   }

  //   if (res) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  /**
   * Reject an uploaded model that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async reject(id: string, comments: string, userId: string) {
    // update status to rejected
    const model = await this.modelRepository.findOne({
      where: { id },
    });
    model.status = UploadedModelStatus.REJECTED;
    model.last_status_update_date = new Date();
    model.updater = userId;
    const res = await this.modelRepository.save(model);

    // save model log
    const actionType: UploadedModelActionTypeEnum =
      UploadedModelActionTypeEnum.REJECT;
    await this.saveLog(
      actionType,
      comments || 'Uploaded model rejected',
      model,
      userId,
    );

    // notify all approvers
    const recipients = await this.getApprovers(model, true);
    if (recipients.length > 0) {
      const message = await this.makeMessage(model, actionType, comments);
      await this.communicate(model, actionType, recipients, message, userId);
    } else {
      const error = 'There are no model approvers';
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
   * Reject an uploaded model that has already been reviewed and formatted
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
    const model = await this.modelRepository.findOne({
      where: { id },
    });

    // save model log
    const actionType: UploadedModelActionTypeEnum =
      UploadedModelActionTypeEnum.SEND_EMAIL;
    const res = await this.saveLog(
      actionType,
      message || 'Communication Sent',
      model,
      userId,
    );

    // notify recipients
    if (recipientEmails && recipientEmails.length > 0) {
      // const message = await this.makeMessage(model, actionType, comments);
      await this.communicate(
        model,
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
   * Reject an uploaded model that has already been reviewed and formatted
   * into VA template by a reviewer
   * @param id
   */
  async requestReupload(id: string, comments: string, userId: string) {
    // update status to rejected
    const model = await this.modelRepository.findOne({
      where: { id },
    });
    if (model.status != UploadedModelStatus.PRIMARY_REVIEW) {
      this.logger.error('The model must be under primary review');
      throw new HttpException('The model must be under primary review', 500);
    }
    model.is_reupload_requested = true;
    model.reupload_requested_date = new Date();
    model.reupload_request_comment = comments;
    model.updater = userId;
    const res = await this.modelRepository.save(model);

    // save model log
    const actionType: UploadedModelActionTypeEnum =
      UploadedModelActionTypeEnum.REQUEST_REUPLOAD;
    await this.saveLog(
      actionType,
      comments || 'Request uploaded model Re-upload',
      model,
      userId,
    );

    // notify assigned reviewers
    const recipients = [userId];
    const message = await this.makeMessage(model, actionType, comments);
    await this.communicate(model, actionType, recipients, message, userId);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  /***
   * Reupload model file
   */
  async reUpload(
    id: string,
    file: Express.Multer.File,
    comments: string,
    userId: string,
  ) {
    const model = await this.modelRepository.findOne({
      where: { id },
    });
    // check if its modifiable
    if (!this.allowReupload(model)) {
      this.logger.error('You cannot perform a model reupload to this model');
      throw 'You cannot perform a model reupload to this model';
    }

    const uploadResp = await this._doUpload(file, RAW_MODEL_CONTAINER); //upload file

    model.is_reupload_requested = false;
    model.last_upload_date = new Date();
    model.uploaded_file_name =
      typeof uploadResp === 'string' ? uploadResp : uploadResp.uploadedFileUrl; // set uploaded file url
    model.reupload_comment = comments;
    model.is_reuploaded = true;
    model.reupload_date = new Date();
    model.updater = userId;
    const res = await this.modelRepository.save(model);

    // save model log
    const actionType = UploadedModelActionTypeEnum.REUPLOAD;
    const actionDetails = `${model.description || model.title}. Previous file=${
      model.uploaded_file_name
    }. Comments=${comments}`;
    await this.saveLog(actionType, actionDetails, res, userId);

    // send acknowledgement email to uploader
    const message = await this.makeMessage(
      model,
      actionType,
      'Uploaded model re-upload',
    );
    // const uploader_email = await this.getUserEmail(userId);
    this.communicate(res, actionType, [userId], message, userId);

    // notify only the assigned reviewers
    const recipients = await this.getReviewers(model, false);
    await this.communicate(model, actionType, recipients, message, userId);
    return res;
  }

  /**
   * Make a communication against the uploaded model
   * @param id
   */
  async communicate(
    model: UploadedModel,
    actionType: UploadedModelActionTypeEnum,
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
    comm.subject = `${actionType} - ${model.title}`;
    comm.message_type = actionType;
    comm.message = message;
    comm.sent_status = CommunicationSentStatus.PENDING;
    comm.sent_date = null;
    comm.reference_entity_type = UploadedModel.name;
    comm.reference_entity_name = model.id;
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
   * Save a corresponding action related to this updated model
   * @param actionType
   * @param actionDetails
   * @param model
   */
  async saveLog(
    actionType: string,
    actionDetails: string,
    model: UploadedModel,
    userId: string,
  ) {
    const log = new UploadedModelLog();
    log.action_type = actionType;
    log.action_details = actionDetails;
    // log.action_date = new Date();
    log.action_taker = userId;
    log.uploaded_model = model;
    log.owner = userId;
    log.updater = userId;
    return await this.uploadedModelLogService.create(log, userId);
  }

  /**
   * Get model status that can allow modification
   * @returns
   */
  getModifiableStatus(): string[] {
    return [UploadedModelStatus['PENDING'].toString()];
  }

  /**
   * Parse a template replacing relevant variables
   * @param actionType
   * @returns
   */
  async makeMessage(
    model: UploadedModel,
    actionType: UploadedModelActionTypeEnum,
    actionDetails: string,
  ): Promise<string> {
    let template = `<b>This is an email from Vector Atlas on ${actionType?.toString()}</b>`;
    switch (actionType) {
      case UploadedModelActionTypeEnum.NEW_UPLOAD:
        template = getNewUploadModelTemplate(model.title);
        break;
      case UploadedModelActionTypeEnum.APPROVE:
        template = getApproveModelTemplate(model.title);
        break;
      case UploadedModelActionTypeEnum.REJECT:
        template = getRejectModelTemplate(model.title, actionDetails);
        break;
      // case UploadedModelActionTypeEnum.REVIEW:
      //   template = getReviewModelTemplate(model.id, actionDetails);
      //   break;
      // case UploadedModelActionTypeEnum.ASSIGN_PRIMARY_REVIEWERS:
      //   template = getAssignPrimaryReviewerTemplate(
      //     model.id,
      //     model.title,
      //     actionDetails,
      //   );
      //   break;
      // case UploadedModelActionTypeEnum.ASSIGN_TERTIARY_REVIEWERS:
      //   template = getAssignTertiaryReviewerTemplate(
      //     model.id,
      //     model.title,
      //     actionDetails,
      //   );
      //   break;
      // case UploadedModelActionTypeEnum.REASSIGN_TERTIARY_REVIEWERS:
      //   template = getReAssignTertiaryReviewerTemplate(
      //     model.id,
      //     model.title,
      //     actionDetails,
      //   );
      //   break;
      // case UploadedModelActionTypeEnum.REJECT_RAW:
      //   template = getRejectRawModelTemplate(model.title, actionDetails);
      //   break;
      // case UploadedModelActionTypeEnum.REJECT_REVIEWED:
      //   template = getRejectReviewedModelTemplate(model.title, actionDetails);
      //   break;
      // case UploadedModelActionTypeEnum.REQUEST_REUPLOAD:
      //   template = getRequestReuploadModelTemplate(
      //     model.id,
      //     model.title,
      //     actionDetails,
      //   );
      //   break;
      default:
        break;
    }
    return template;
  }

  /**
   * Get list of all reviewers both primary and tertiary
   * @param model
   * @param includeAllReviewers. If true, it will include all users with review role. Else, will only return reviewers associated with the model
   * @returns
   */
  getApprovers = async (
    model?: UploadedModel,
    includeAllApprovers = false,
  ): Promise<string[]> => {
    const approvers = model ? model.approved_by || [] : [];
    let others = [];
    if (includeAllApprovers) {
      try {
        others = await this.authService.getRoles(Role.ModelManager);
      } catch (error) {
        this.logger.error(error);
        console.log(error);
      }
    }
    const all = approvers.concat(others.map((el: UserRole) => el.auth0_id));
    if (process.env.NODE_ENV == 'test') {
      all.push(process.env.EMAIL_FROM);
    }
    return [...new Set(all)];
  };

  /**
   * Get list of all reviewers both primary and tertiary
   * @param dataset
   * @param includeAllReviewers. If true, it will include all users with review role. Else, will only return reviewers associated with the dataset
   * @returns
   */
  getReviewers = async (
    model?: UploadedModel,
    includeAllReviewers = false,
  ): Promise<string[]> => {
    return this.getApprovers(model, includeAllReviewers);
    const primary = model.reviewers || [];
    // const tertiary = dataset.tertiary_reviewers || [];
    let others = [];
    if (includeAllReviewers) {
      try {
        others = await this.authService.getRoles(Role.ModelManager);
      } catch (error) {
        this.logger.error(error);
        console.log(error);
      }
    }
    const all = primary.concat(others.map((el: UserRole) => el.auth0_id));
    if (process.env.NODE_ENV == 'test') {
      all.push(process.env.EMAIL_FROM);
    }
    return [...new Set(all)];
  };

  // getPrimaryReviewers = async (model: UploadedModel): Promise<string[]> => {
  //   const primary = model.primary_reviewers || [];
  //   if (process.env.NODE_ENV == 'test') {
  //     primary.push(process.env.EMAIL_FROM);
  //   }
  //   return [...new Set(primary)];
  // };

  // getApprovers = async (
  //   model: UploadedModel,
  // ): Promise<string[]> => {
  //   const tertiary = model.approved_by || [];
  //   if (process.env.NODE_ENV == 'test') {
  //     tertiary.push(process.env.EMAIL_FROM);
  //   }
  //   return [...new Set(tertiary)];
  // };

  // /**
  //  * Get list of all model managers
  //  * @param model
  //  * @returns
  //  */
  // getUploadedModelManagers = async (): Promise<string[]> => {
  //   let others = [];
  //   try {
  //     others = await this.authService.getRoles(Role.ReviewerManager);
  //     // others = await this.authService.getRoleEmails(Role.ReviewerManager);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   const all = [].concat(others?.map((el) => el.auth0_id));
  //   if (process.env.NODE_ENV == 'test') {
  //     all.push(process.env.EMAIL_FROM);
  //   }
  //   return [...new Set(all)];
  // };

  // /**
  //  * Validate either an existing model or an adhoc one
  //  * @param datasetId
  //  * @param file
  //  * @returns
  //  */
  // async validate(
  //   datasetId?: string,
  //   file?: Express.Multer.File,
  //   isApprovingContext = false,
  // ) {
  //   const dataFile: any = null;
  //   let model: UploadedModel = null;
  //   let destFile = '';
  //   const destFolder = process.env.TEMP_DIR;
  //   ensureDirectoryExists(destFolder);
  //   let error;
  //   if (!datasetId && !file) {
  //     error =
  //       'You must specify either model id or the file that is to be validated';
  //     // throw Error(
  //     //   error
  //     // );
  //     return makeResponse({
  //       isError: true,
  //       error,
  //     });
  //   }
  //   if (datasetId) {
  //     // update status to approved
  //     model = await this.modelRepository.findOne({
  //       where: { id: datasetId },
  //     });
  //     if (!datasetId) {
  //       error = 'Uploaded model with the specified id does not exist';
  //       this.logger.error(error);
  //       //throw Error(error);
  //       return makeResponse({
  //         isError: true,
  //         error,
  //       });
  //     }
  //     if (
  //       model.status != UploadedModelStatus.PENDING_APPROVAL &&
  //       model.status != UploadedModelStatus.APPROVED
  //     ) {
  //       const error =
  //         'Uploaded model cannot be validated since it has not completed tertiary review';
  //       // throw Error(error );
  //       this.logger.error(error);
  //       return makeResponse({
  //         isError: true,
  //         error,
  //       });
  //     }

  //     destFile = await this.downloadToFileStorage(
  //       model.uploaded_file_name_tertiary_reviewed,
  //       destFolder,
  //     );
  //   } else {
  //     // we are doing adhoc validation
  //     const fileName = makeFileNameTimestamped(
  //       file.originalname,
  //       'adhoc-validation',
  //     );
  //     destFile = `${destFolder}/${fileName}`;
  //     await fs.writeFileSync(destFile, file.buffer);
  //   }
  //   const url = process.env.DATA_VALIDATION_URL;
  //   const formData = new FormData();
  //   formData.append('file', fs.createReadStream(destFile));
  //   try {
  //     const res = await axios.post(url, formData, {});
  //     // if (datasetId) {
  //     //   // Save model log
  //     //   const actionType: UploadedModelActionTypeEnum =
  //     //     UploadedModelActionTypeEnum.VALIDATE;
  //     //   await this.saveLog(
  //     //     actionType,
  //     //     UploadedModelActionTypeEnum.VALIDATE,
  //     //     model,
  //     //   );
  //     // }
  //     return isApprovingContext ? res : res.data;
  //   } catch (error) {
  //     console.error(error);
  //     this.logger.error('Validate POST error: ', error);
  //   }
  // }

  // /**
  //  * Ingest an uploaded model
  //  * @param datasetId
  //  * @returns
  //  */
  // async ingest(datasetId: string) {
  //   // Run validate first
  //   const validationRes = await this.validate(datasetId, null, true);
  //   if (validationRes?.data.valid_data === true) {
  //     // validation was successful
  //   } else {
  //     return makeResponse({
  //       isError: !validationRes.data?.valid_data,
  //       data: validationRes.data,
  //       error: validationRes.data?.errors,
  //     });
  //   }

  //   let model: UploadedModel = null;
  //   let destFile = '';
  //   const destFolder = process.env.TEMP_DIR;
  //   ensureDirectoryExists(destFolder);
  //   let error = '';
  //   // update status to approved
  //   model = await this.modelRepository.findOne({
  //     where: { id: datasetId },
  //   });
  //   if (!datasetId) {
  //     error = 'Uploaded model with the specified id does not exist';
  //     this.logger.error(error);
  //     return makeResponse({
  //       isError: true,
  //       error,
  //     });
  //   }
  //   if (
  //     model.status != UploadedModelStatus.PENDING_APPROVAL &&
  //     model.status != UploadedModelStatus.APPROVED
  //   ) {
  //     error =
  //       'Uploaded model cannot be approved since it has not completed tertiary review';
  //     this.logger.error(error);
  //     return makeResponse({
  //       isError: true,
  //       error,
  //     });
  //   }

  //   // check that there is no existing model as a result of this uploaded model
  //   this.datasetService;

  //   destFile = await this.downloadToFileStorage(
  //     model.uploaded_file_name_tertiary_reviewed,
  //     process.env.TEMP_DIR,
  //   );
  //   let formData = new FormData();
  //   const config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };
  //   formData.append('file', fs.createReadStream(destFile));

  //   let ingestRes;
  //   if (validationRes.data?.valid_data) {
  //     const ingestUrl = process.env.DATA_INGESTION_URL;
  //     formData = new FormData();
  //     formData.append('file', fs.createReadStream(destFile));
  //     ingestRes = await axios.post(ingestUrl, formData, config);
  //     return makeResponse({
  //       isError: !ingestRes.data?.valid_data,
  //       data: ingestRes.data,
  //       error: ingestRes.data?.errors,
  //     });
  //   }
  //   return makeResponse({
  //     isError: !validationRes.data?.valid_data,
  //     data: validationRes.data,
  //     error: validationRes.data?.errors,
  //   });
  // }

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

  /**
   * Download model to local storage
   * @param fileSource
   * @param destFolder
   * @param destFileName
   * @param harmonizeTiffExtension : Replace .tiff with .tif
   * @returns
   */
  downloadToFileStorage = async (
    fileSource: string,
    destFolder: string,
    destFileName?: string,
    harmonizeTiffExtension = false,
  ) => {
    if (fileSource.startsWith('http')) {
      let fileName = extractFileNameFromBlobUrl(fileSource);
      fileName = fileName.split('/').pop();
      let destFile = `${destFolder}/${fileName}`;
      if (destFileName) {
        destFile = `${destFolder}/${destFileName}`;
        if (destFileName.split('.').length === 1) {
          // check if file extension is not specified
          const extension = fileName.split('.').pop();
          destFile = destFile + `.${extension}`;
        }
      }
      if (harmonizeTiffExtension) {
        destFile = destFile.replace('.tiff', '.tif');
      }

      await this.azureBlobService.downloadToLocalFile(
        fileSource, // fileName,
        APPROVED_MODEL_CONTAINER,
        destFile,
      );
      return destFile;
    } else {
      return fileSource;
    }

    // if (fileSource.startsWith('http')) {
    //   const fileName = fileSource.split('/').pop();
    //   let destFile = `${destFolder}/${fileName}`;
    //   if (destFileName) {
    //     destFile = `${destFolder}/${destFileName}`;
    //     if (destFileName.split('.').length === 1) {
    //       // check if file extension is not specified
    //       const extension = fileSource.split('.').pop();
    //       destFile = destFile + `.${extension}`;
    //     }
    //   }
    //   //
    //   if (harmonizeTiffExtension) {
    //     destFile = destFile.replace('.tiff', '.tif');
    //   }

    //   await this.azureBlobService.downloadToLocalFile(
    //     fileName,
    //     RAW_MODEL_CONTAINER,
    //     destFile,
    //   );
    //   return destFile;
    // } else {
    //   return fileSource;
    // }
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
