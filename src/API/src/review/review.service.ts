import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { Repository } from 'typeorm';

export const getAuth0Token = async (http: HttpService) => {
  const token = await lastValueFrom(
    http.post(`https://dev-326tk4zu.us.auth0.com/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: 'sQPoZzmH4QaAHVEJrDaK3pPeHG0SmCtr',
      client_secret: 'u6gsaL3kmxHPSmAYVXoJxaD5gbz0x3WhyRZQAzY7calz0y40rwmP2wOBbzigVTOt',
      audience: 'https://dev-326tk4zu.us.auth0.com/api/v2/'
    }, {headers: {'content-type': 'application/x-www-form-urlencoded',
       "Accept-Encoding": "gzip,deflate,compress"}}).pipe(
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
    ){}

    async reviewDataset(datasetId: string, reviewerId?:string, reviewFeedback?: string){
      try{
        const token = await getAuth0Token(this.httpService);
       if(datasetId){
          const dataset = await this.datasetRepository.findOne({
             where: {id: datasetId}
           });

           if(dataset == null){
             throw new HttpException('Not a valid dataset id', 500);
           }


           const userId = dataset.UpdatedBy;

           const emailAddress = await lastValueFrom(
            this.httpService.get(`https://dev-326tk4zu.us.auth0.com/api/v2/users/${userId}`,
            {headers: {authorization: `Bearer ${token}`, "Accept-Encoding": "gzip,deflate,compress"}})
            .pipe(
              map((res: any) => {
                return res.data.email;
              }),
            ),
          );


           const review_res = `<div>
           <h2>Reviewer Feedback</h2>
           <p>Dataset with id ${datasetId} has been reviewed. Please see review comments below, and visit http://www.vectoratlas.icipe.org/review?dataset=${datasetId} to make changes.</p>
           <p>${reviewFeedback}</p>
           </div>`;
           this.mailerService.sendMail({
             to: [emailAddress, process.env.REVIEWER_EMAIL_LIST],
             from: 'vectoratlas-donotreply@icipe.org',
             subject: 'Reviewer Feedback',
             html: review_res
           })

           await this.datasetRepository.update(
             {id:datasetId},
             {status:'In review'});

            return review_res;
           }
           else
           if(!datasetId){
             throw new HttpException('Not a valid dataset id', 500);
           }
      }catch (e) {
        this.logger.error(e);
        throw e;
      }
    }

    async approveDataset(datasetId, userId) {
      const dataset = await this.datasetRepository.findOne({
        where: {id: datasetId}
      });

      if(dataset == null){
        throw new HttpException('Not a valid dataset id', 500);
      }

      const userAlreadyApproved = dataset.ApprovedBy.includes(userId);
      if (userAlreadyApproved) {
        return;
      }
      const fullApproval = dataset.ApprovedBy.length > 0;
      if (!userAlreadyApproved) {
        dataset.ApprovedBy.push(userId);
        dataset.ApprovedAt.push(new Date());
      }
      dataset.status = fullApproval ? 'Approved' : 'In review';
      await this.datasetRepository.update(
        {id: datasetId},
        dataset
      );

      const uploader= dataset.UpdatedBy;
      const token = await getAuth0Token(this.httpService);

      const uploaderEmail = await lastValueFrom(
       this.httpService.get(`https://dev-326tk4zu.us.auth0.com/api/v2/users/${uploader}`,
       {headers: {authorization: `Bearer ${token}`, "Accept-Encoding": "gzip,deflate,compress"}})
       .pipe(
         map((res: any) => {
           return res.data.email;
         }),
       ),
     );
      const approverEmail = await lastValueFrom(
       this.httpService.get(`https://dev-326tk4zu.us.auth0.com/api/v2/users/${userId}`,
       {headers: {authorization: `Bearer ${token}`, "Accept-Encoding": "gzip,deflate,compress"}})
       .pipe(
         map((res: any) => {
           return res.data.email;
         }),
       ),
     );

     let approvalText = `<div>
           <h2>Data Approval</h2>
           <p>Dataset with id ${datasetId} has been approved by ${approverEmail}.</p>`;
      approvalText = approvalText + (fullApproval ? '<p>This completes the review process. The data is now public, and viewable on the map.</p>' : '<p>One more approval is needed for this dataset to become public</p>');
      approvalText = approvalText + '</div>';

      this.mailerService.sendMail({
        to: [uploaderEmail, process.env.REVIEWER_EMAIL_LIST],
        from: 'vectoratlas-donotreply@icipe.org',
        subject: 'Dataset Approved',
        html: approvalText
      });

    }
}
