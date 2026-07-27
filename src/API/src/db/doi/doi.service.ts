import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { getRandomInt } from './util';
import {
  ApprovalStatus,
  CommunicationChannelType,
  CommunicationSentStatus,
  DoiActionType,
  DOISourceType,
  UploadedDatasetStatus,
  UploadedModelStatus,
} from '../../../src/commonTypes';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { EmailService } from '../../email/email.service';
import { getApproveDoiTemplate, getRejectDoiTemplate } from 'templates/doi';
import { UploadedDataset } from '../uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetService } from '../uploaded-dataset/uploaded-dataset.service';
import { AuthService } from 'src/auth/auth.service';
import { UploadedModel } from '../uploaded-model/entities/uploaded-model.entity';

@Injectable()
export class DoiService {
  constructor(
    @InjectRepository(DOI)
    private doiRepository: Repository<DOI>,
    private readonly httpService: HttpService,
    private emailService: EmailService,
    private authService: AuthService,
    private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager, // @InjectRepository(UploadedDataset) // private uploadedDatasetRepository: Repository<UploadedDataset>, // @Inject(forwardRef(() => UploadedDatasetService)) // private readonly uploadedDatasetService: UploadedDatasetService,
  ) {}

  async upsert(doi: DOI): Promise<DOI> {
    return await this.doiRepository.save(doi);
  }

  async getDOI(id: string): Promise<DOI> {
    return await this.doiRepository.findOne({
      where: { id: id },
      relations: ['uploaded_dataset'],
    });
  }

  async getDOIByResolverID(resolverId: string): Promise<DOI> {
    // return also the occurrence ids since we are now storing the occurrence ids in exportJob entity
    return await this.doiRepository.findOne({
      where: { resolver_id: resolverId },
      relations: ['uploaded_dataset', 'uploaded_model', 'export_job'],
    });
  }

  async getDOIByUploadedDataset(
    uploadedDatasetId: string,
  ): Promise<DOI | undefined> {
    const all = await this.getDOIs();
    const res = all.filter(
      (el) => el.uploaded_dataset?.id == uploadedDatasetId,
    );
    return res.length > 0 ? res[0] : undefined;
  }

  async getDOIsByUploadedDataset(
    uploadedDatasetId: string,
  ): Promise<DOI[] | undefined> {
    const all = await this.getDOIs();
    const res = all.filter(
      (el) => el.uploaded_dataset?.id == uploadedDatasetId,
    );
    return res;
  }

  async getDOIs(): Promise<DOI[]> {
    const res = await this.doiRepository.find({
      order: {
        modified: 'DESC',
      },
    }); /*{
      relations: ['site', 'sample', 'recordedSpecies'],
    });*/
    return res;
  }

  async getDOIByUploadedModel(
    uploadedModelId: string,
  ): Promise<DOI | undefined> {
    const all = await this.getDOIs();
    const res = all.filter((el) => el.uploaded_model?.id == uploadedModelId);
    return res.length > 0 ? res[0] : undefined;
  }

  async getDOIsByUploadedModel(
    uploadedModelId: string,
  ): Promise<DOI[] | undefined> {
    const all = await this.getDOIs();
    const res = all.filter((el) => el.uploaded_model?.id == uploadedModelId);
    return res;
  }

  async getDOIsByStatus(status: string): Promise<DOI[]> {
    return await this.doiRepository.find({
      where: { approval_status: status },
      order: {
        modified: 'DESC',
      },
    });
  }

  async removeByDataset(datasetId: string) {
    const res = await this.getDOIsByUploadedDataset(datasetId);
    if (res) {
      return await this.doiRepository.remove(res);
    }
    return null;
  }

  async removeByModel(modelId: string) {
    const res = await this.getDOIsByUploadedModel(modelId);
    if (res) {
      return await this.doiRepository.remove(res);
    }
    return null;
  }

  async approveDOI(
    doiId: string,
    userId: string,
    comments?: string,
    recipients?: string[],
  ): Promise<DOI> {
    const doi = await this.getDOI(doiId);
    if (doi.approval_status == ApprovalStatus.APPROVED) {
      return doi;
    }
    let relatedData = null;
    if (doi.source_type == DOISourceType.UPLOAD) {
      if (!doi.uploadedDatasetId) {
        this.logger.error('The uploaded dataset does not exist');
        throw Error('The uploaded dataset does not exist');
      }

      // check if uploaded dataset has been approved
      const ds: UploadedDataset = await this.entityManager
        .createQueryBuilder(UploadedDataset, 'dataset')
        .select()
        .where('dataset.id= :datasetId', {
          datasetId: doi.uploaded_dataset?.id,
        })
        .getOne();

      // await this.doiRepository.query(
      //   // eslint-disable-next-line max-len
      //   'UPDATE occurrence SET download_count = occurrence.download_count + 1 FROM dataset WHERE dataset.status = \'Approved\' AND occurrence."datasetId" = dataset.id;',
      // );

      if (ds.status != UploadedDatasetStatus.APPROVED) {
        this.logger.error('The dataset has not been approved');
        throw Error('The dataset has not been approved');
      }
      relatedData = ds.provided_doi;
      doi.affiliated_institution = ds.affiliated_institution;
      doi.creator_name = ds.uploader_name;
      doi.author = ds.author;

      if (ds.uploader) {
        await this.authService.init();
        const uploader_email = await this.authService.getEmailFromUserId(
          ds.uploader,
        );
        recipients = (recipients || []).concat(uploader_email);
      }
    } else if (doi.source_type == DOISourceType.DOWNLOAD) {
      recipients = (recipients || []).concat(
        doi.creator_email ? doi.creator_email : [],
      );
    } else if (doi.source_type === DOISourceType.MODEL_UPLOAD) {
      if (!doi.uploaded_model) {
        this.logger.error('The uploaded model does not exist');
        throw Error('The uploaded model does not exist');
      }

      // check if uploaded dataset has been approved
      const ds: UploadedModel = await this.entityManager
        .createQueryBuilder(UploadedModel, 'model')
        .select()
        .where('model.id= :modelId', {
          modelId: doi.uploaded_model?.id,
        })
        .getOne();

      if (ds.status != UploadedModelStatus.APPROVED) {
        this.logger.error('The model has not been approved');
        throw Error('The model has not been approved');
      }
      relatedData = ds.provided_doi;
      doi.affiliated_institution = ds.affiliated_institution;
      doi.creator_name = ds.uploader_name;
      doi.author = ds.author;

      if (ds.uploader) {
        await this.authService.init();
        const uploader_email = await this.authService.getEmailFromUserId(
          ds.uploader,
        );
        recipients = (recipients || []).concat(uploader_email);
      }
    }
    const res = await this.generateDOI(doi, relatedData, userId);
    if (!res) {
      this.logger.error('Error. Could not mint a DOI for the model');
      throw 'Error. Could not mint a DOI for the model';
    }
    doi.approval_status = ApprovalStatus.APPROVED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = userId;
    doi.comments = comments;
    doi.updater = userId;
    const saveRes = await this.doiRepository.save(doi);
    if (recipients) {
      const message = await this.makeMessage(
        doi,
        DoiActionType.APPROVE,
        comments,
      );
      if (doi.source_type === DOISourceType.DOWNLOAD) {
        // IF we are downloading the dataset, no need to send a second email since the doi is already
        // attached in the email communication. See dynamicExportService.exportAllToExcelBackground
      } else {
        await this.communicate(
          doi,
          DoiActionType.APPROVE,
          recipients,
          message,
          userId,
        );
      }
    }
    return saveRes;
  }

  async rejectDOI(
    doiId: string,
    userId: string,
    comments?: string,
    recipients?: string[],
  ): Promise<DOI> {
    const doi = await this.getDOI(doiId);
    if (doi.source_type == DOISourceType.UPLOAD) {
      if (!doi.uploadedDatasetId) {
        this.logger.error('The uploaded dataset does not exist');
        throw Error('The uploaded dataset does not exist');
      }

      // check if uploaded dataset has been approved
      const ds: UploadedDataset = await this.entityManager
        .createQueryBuilder(UploadedDataset, 'dataset')
        .select()
        .where('dataset.id= :datasetId', {
          datasetId: doi.uploaded_dataset?.id,
        })
        .getOne();

      if (ds.status != UploadedDatasetStatus.APPROVED) {
        this.logger.error('The dataset has not been approved');
        throw Error('The dataset has not been approved');
      }

      if (ds.uploader) {
        await this.authService.init();
        const uploader_email = await this.authService.getEmailFromUserId(
          ds.uploader,
        );
        recipients = (recipients || []).concat(uploader_email);
      }
    } else if (doi.source_type == DOISourceType.DOWNLOAD) {
      recipients = (recipients || []).concat(
        doi.creator_email ? doi.creator_email : [],
      );
    }

    if (doi.approval_status == ApprovalStatus.REJECTED) {
      this.logger.error('The dataset has already been rejected');
      throw Error('The dataset has not been approved');
    }

    doi.approval_status = ApprovalStatus.REJECTED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = userId;
    doi.comments = comments;
    doi.updater = userId;
    const saveRes = await this.doiRepository.save(doi);

    if (recipients) {
      const message = await this.makeMessage(
        doi,
        DoiActionType.REJECT,
        comments,
      );
      await this.communicate(
        doi,
        DoiActionType.REJECT,
        recipients,
        message,
        userId,
      );
    }
    return saveRes;
  }

  async generateDOI(doi: DOI, relatedData: string, userId: string) {
    const _makePayload = () => {
      const data = {
        data: {
          type: 'dois',
          attributes: {
            //only publish when we are in production environemnt
            event: process.env.DOI_ENVIRONMENT == 'production' ? 'publish' : '',
            prefix: process.env.DATACITE_PREFIX,
            creators: [
              {
                name:
                  doi.source_type == 'Download'
                    ? process.env.DOI_PUBLISHER
                    : doi.author || '',
                affiliation:
                  doi.source_type == 'Download'
                    ? process.env.DOI_PUBLISHER
                    : doi.affiliated_institution || '',
              },
            ],
            titles: [
              {
                name: doi.title,
              },
            ],
            publisher: process.env.DOI_PUBLISHER,
            publicationYear: doi.publication_year,
            types: {
              resourceTypeGeneral: 'Dataset',
            },
            url: `${process.env.DOI_RESOLVER_BASE_URL}${resolverId}`,
          },
        },
      };
      if (relatedData) {
        data['data']['relatedIdentifiers'] = [
          {
            relationType: 'IsSupplementTo',
            relatedIdentifier: relatedData,
            resourceTypeGeneral: 'Dataset',
            relatedIdentifierType: 'DOI',
          },
        ];
      }
      return data;
    };

    const resolverId = getRandomInt(4);
    const data = _makePayload();
    const res = await lastValueFrom(
      this.httpService
        .post(process.env.DATACITE_URL, data, {
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
          auth: {
            username: process.env.DATACITE_USER,
            password: process.env.DATACITE_PASSWORD,
          },
        })
        ?.pipe(
          map((resp: any) => {
            if (resp.status == HttpStatus.CREATED) {
              return resp.data;
            }
          }),
        ),
    );
    if (res) {
      // update doi
      doi.doi_response = res;
      doi.resolver_id = resolverId;
      doi.is_draft = res?.data?.attributes?.state == 'draft';
      doi.doi_id = res?.data?.id;
      doi.resolving_url = res?.data?.attributes?.url;
      doi.doi_link = `https://doi.org/${res?.data?.id}`;
      doi.updater = userId;
      await this.doiRepository.save(doi);
      return res;
    }
    return null;
  }

  /**
   * Parse a template replacing relevant variables
   * @param actionType
   * @returns
   */
  async makeMessage(
    doi: DOI,
    actionType: DoiActionType,
    comments = '',
  ): Promise<string> {
    let template = `<b>This is an email from Vector Atlas on ${actionType?.toString()}</b>`;
    switch (actionType) {
      case DoiActionType.APPROVE:
        template = getApproveDoiTemplate(doi.title, doi.doi_link, comments);
        break;
      case DoiActionType.REJECT:
        template = getRejectDoiTemplate(doi.title, comments);
        break;
      default:
        break;
    }
    return template;
  }

  getUserEmail = async (userId: string) => {
    if (userId.indexOf('@') != -1) {
      return userId;
    }
    await this.authService.init();
    return await this.authService.getEmailFromUserId(userId);
  };

  /**
   * Make a communication against the uploaded dataset
   * @param id
   */
  async communicate(
    doi: DOI,
    actionType: DoiActionType,
    recipients: string[],
    message: string,
    userId: string,
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
    comm.subject = `${actionType} - ${doi.title}`;
    comm.channel_type = CommunicationChannelType.EMAIL;
    comm.recipients = recipients;
    comm.message_type = actionType;
    comm.message = message;
    comm.sent_status = CommunicationSentStatus.PENDING;
    comm.sent_date = null;
    comm.reference_entity_type = DOI.name;
    comm.reference_entity_name = doi.id;
    comm.owner = userId;
    comm.updater = userId;
    // //return await this.communicationLogService.send(comm);
    this.emailService.sendEmail(
      toSend.map((el) => el.email),
      [],
      actionType,
      message,
      [],
      comm,
    );
  }
}
