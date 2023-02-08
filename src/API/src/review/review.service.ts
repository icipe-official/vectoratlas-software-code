import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { Repository } from 'typeorm';

export const getAuth0Token = async (http: HttpService) => {
  const token = await lastValueFrom(
    http
      .post(
        'https://dev-326tk4zu.us.auth0.com/oauth/token',
        {
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: 'https://dev-326tk4zu.us.auth0.com/api/v2/',
        },
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        },
      )
      .pipe(
        map((res: any) => {
          return res.data.access_token;
        }),
      ),
  );
  return token;
};

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Dataset)
    private datasetRepository: Repository<Dataset>,
    private logger: Logger,
    private readonly mailerService: MailerService,
    private readonly httpService: HttpService,
  ) {}

  async reviewDataset(
    datasetId: string,
    reviewerId: string,
    reviewFeedback: string,
  ) {
    try {
      const token = await getAuth0Token(this.httpService);
      const dataset = await this.datasetRepository.findOne({
        where: { id: datasetId },
      });

      if (dataset == null) {
        throw new HttpException('Not a valid dataset id', 500);
      }

      const userId = dataset.UpdatedBy;

      const emailAddress = await lastValueFrom(
        this.httpService
          .get(`https://dev-326tk4zu.us.auth0.com/api/v2/users/${userId}`, {
            headers: {
              authorization: `Bearer ${token}`,
              'Accept-Encoding': 'gzip,deflate,compress',
            },
          })
          .pipe(
            map((res: any) => {
              return res.data.email;
            }),
          ),
      );

      dataset.ReviewedBy.push(reviewerId);
      dataset.ReviewedAt.push(new Date());
      dataset.status = 'In review';

      await this.datasetRepository.update({ id: datasetId }, dataset);

      const review_res = `<div>
<h2>Reviewer Feedback</h2>
<p>Dataset with id ${datasetId} has been reviewed. Please see review comments below, and visit http://www.vectoratlas.icipe.org/review?dataset=${datasetId} to make changes.
This dataset has been reviewed by ${reviewerId}</p>
<p>${reviewFeedback}</p>
</div>`;
      this.mailerService.sendMail({
        to: [emailAddress, process.env.REVIEWER_EMAIL_LIST],
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Reviewer Feedback',
        html: review_res,
      });

      return review_res;
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Something went wrong with dataset review', 500);
    }
  }
}
