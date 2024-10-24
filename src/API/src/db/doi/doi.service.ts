import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DOI } from './entities/doi.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpStatusCode } from 'axios';
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
    return await this.doiRepository.find({
      relations: ['site', 'sample', 'recordedSpecies'],
    });
  }

  remove(id: string) {
    return `This action removes a #${id} doi`;
  }

  async approveDOI(doi: DOI): Promise<DOI> {
    const res = await this.generateDOI(doi);
    if (!res) {
      throw 'Error. Could not mint a DOI';
    }
    // const doiRec = await this.getDOI(doi.id);
    // if (!doiRec) {
    //   throw 'Error on DOI approval';
    // }
    doi.approval_status = ApprovalStatus.APPROVED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = getCurrentUser();
    return await this.doiRepository.save(doi);
  }

  async rejectDOI(doi: DOI): Promise<DOI> {
    doi.approval_status = ApprovalStatus.REJECTED;
    doi.status_updated_on = new Date();
    doi.status_updated_by = getCurrentUser();
    return await this.doiRepository.save(doi);
  }

  async generateDOI(doi: DOI) {
    const _makePayload = () => {
      const data = {
        data: {
          type: 'dois',
          attributes: {
            //"event": "publish",
            prefix: process.env.DATACITE_PREFIX,
            creators: [
              {
                name: 'Steve Nyaga under Vector Analysis Working Group',
              },
            ],
            titles: [
              {
                name: 'Testing first DOI minting',
              },
            ],
            publisher: 'ICIPE',
            publicationYear: 2016,
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

    // const token = await lastValueFrom(
    //   http.post(`${process.env.ANALYTICS_API_URL}/auth/login`, user).pipe(
    //     map((res: any) => {
    //       return res.data.token;
    //     }),
    //   ),
    // );
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
      // doi.doi_response =
      /*res.pipe(
        map((response) => {
          if (response.status == HttpStatus.CREATED) {
            doi.doi_response = response.data; //, response.status
            doi.resolver_id = resolverId;
            doi.doi_id = response.data.attributes.doi;
            // update with the updated doi
            this.upsert(doi);
          }
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );*/
      // update doi
      doi.doi_response = res;
      doi.resolver_id = resolverId;
      doi.is_draft = res?.data?.attributes?.state == 'draft';
      doi.doi_id = res?.data?.id;
      await this.doiRepository.save(doi);
      return res;
    }
    return null;
  }
}

/*
{
  "data": {
    "type": "dois",
    "attributes": {
      "event": "publish",
      "prefix": "10.5438",
      "creators": [
        {
          "name": "DataCite Metadata Working Group"
        }
      ],
      "titles": [
        {
          "title": "DataCite Metadata Schema Documentation for the Publication and Citation of Research Data v4.0"
        }
      ],
      "publisher": "DataCite e.V.",
      "publicationYear": 2016,
      "types": {
        "resourceTypeGeneral": "Text"
      },
      "url": "https://example.org"
    }
  }
}*/
