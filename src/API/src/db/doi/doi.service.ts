import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { getCurrentUser, getRandomInt } from './util';
import { ApprovalStatus } from 'src/commonTypes';

@Injectable()
export class DoiService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(DOI)
    private doiRepository: Repository<DOI>,
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

  async approveDOI(doiId: string, comments?: string): Promise<DOI> {
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
    return await this.doiRepository.save(doi);
  }

  async rejectDOI(doiId: string, comments?: string): Promise<DOI> {
    const doi = await this.getDOI(doiId);
    if (doi.approval_status == ApprovalStatus.REJECTED) {
      return doi;
    }
    doi.approval_status = ApprovalStatus.REJECTED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = getCurrentUser();
    doi.comments = comments;
    return await this.doiRepository.save(doi);
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
}
