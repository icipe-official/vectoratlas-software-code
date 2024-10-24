import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { getCurrentUser, getRandomInt } from './util';
import {
  ApprovalStatus,
  CommunicationChannelType,
  CommunicationSentStatus,
  DoiActionType,
  UploadedDatasetActionType,
} from 'src/commonTypes';
import { CommunicationLog } from '../communication-log/entities/communication-log.entity';
import { EmailService } from '../../email/email.service';
import { getApproveDoiTemplate, getRejectDoiTemplate } from 'templates/doi';

@Injectable()
export class DoiService {
  constructor(
    @InjectRepository(DOI)
    private doiRepository: Repository<DOI>,
    private readonly httpService: HttpService,
    private emailService: EmailService,
  ) {}

  async upsert(doi: DOI): Promise<DOI> {
    return await this.doiRepository.save(doi);
  }

  async getDOI(id: string): Promise<DOI> {
    return await this.doiRepository.findOne({ where: { id: id } });
  }

  async getDOIs(): Promise<DOI[]> {
    return await this.doiRepository.find(); /*{
      relations: ['site', 'sample', 'recordedSpecies'],
    });*/
  }

  async getDOIsByStatus(status: string): Promise<DOI[]> {
    return await this.doiRepository.find({
      where: { approval_status: status },
    });
  }

  async approveDOI(
    doiId: string,
    comments?: string,
    recipients?: [string],
  ): Promise<DOI> {
    const doi = await this.getDOI(doiId);
    if (doi.approval_status == ApprovalStatus.APPROVED) {
      return doi;
    }
    const res = await this.generateDOI(doi);
    if (!res) {
      throw 'Error. Could not mint a DOI';
    }
    doi.approval_status = ApprovalStatus.APPROVED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = getCurrentUser();
    doi.comments = comments;
    const saveRes = await this.doiRepository.save(doi);
    if (recipients) {
      const message = await this.makeMessage(
        doi,
        DoiActionType.APPROVE,
        comments,
      );
      await this.communicate(doi, DoiActionType.APPROVE, recipients, message);
    }
    return saveRes;
  }

  async rejectDOI(
    doiId: string,
    comments?: string,
    recipients?: [string],
  ): Promise<DOI> {
    const doi = await this.getDOI(doiId);
    if (doi.approval_status == ApprovalStatus.REJECTED) {
      return doi;
    }
    doi.approval_status = ApprovalStatus.REJECTED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = getCurrentUser();
    doi.comments = comments;
    const saveRes = await this.doiRepository.save(doi);
    if (recipients) {
      const message = await this.makeMessage(
        doi,
        DoiActionType.REJECT,
        comments,
      );
      await this.communicate(doi, DoiActionType.REJECT, recipients, message);
    }
    return saveRes;
  }

  async generateDOI(doi: DOI) {
    const _makePayload = () => {
      const data = {
        data: {
          type: 'dois',
          attributes: {
            event: process.env.NODE_ENV == 'production' ? 'publish' : '', //only publish when we are in production environemnt
            prefix: process.env.DATACITE_PREFIX,
            creators: [
              {
                name: process.env.DOI_PUBLISHER,
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
            url: `${process.env.DOI_RESOLVER_BASE_URL}/${resolverId}`,
          },
        },
      };
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
        template = getApproveDoiTemplate(doi.title, doi.doi_id, comments);
        break;
      case DoiActionType.REJECT:
        template = getRejectDoiTemplate(doi.title, comments);
        break;
      default:
        break;
    }
    return template;
  }

  /**
   * Make a communication against the uploaded dataset
   * @param id
   */
  async communicate(
    doi: DOI,
    actionType: DoiActionType,
    recipient_emails: string[],
    message: string,
  ) {
    // create a communication log
    const comm = new CommunicationLog();
    comm.channel_type = CommunicationChannelType.EMAIL;
    comm.recipients = recipient_emails;
    comm.message_type = actionType;
    comm.message = message;
    comm.sent_status = CommunicationSentStatus.PENDING;
    comm.sent_date = null;
    comm.reference_entity_type = DOI.name;
    comm.reference_entity_name = doi.id;
    // //return await this.communicationLogService.send(comm);
    this.emailService.sendEmail(
      comm.recipients,
      [],
      actionType,
      message,
      [],
      comm,
    );
  }
}
