import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, map } from 'rxjs';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { Repository } from 'typeorm';

export const getAuth0Token = async (http: HttpService) => {
  const options = {
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'sQPoZzmH4QaAHVEJrDaK3pPeHG0SmCtr',
    client_secret: 'u6gsaL3kmxHPSmAYVXoJxaD5gbz0x3WhyRZQAzY7calz0y40rwmP2wOBbzigVTOt',
    audience: 'https://dev-326tk4zu.us.auth0.com/api/v2/'
  })

  };
  const token = await lastValueFrom(
    http.post(`https://dev-326tk4zu.us.auth0.com/oauth/token`, options).pipe(
      map((res: any) => {
        return res.data.token;
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

    async reviewDataset(reviewerId?:string, datasetId?: string, reviewFeedback?: string){
      try{
        const token = getAuth0Token(this.httpService);
        console.log(token)

        // if(datasetId){
        //   const dataset = await this.datasetRepository.findOne({
        //     where: {id: datasetId}
        //   });

        //   if(dataset == null){
        //     throw new HttpException('Not a valid dataset id', 500);
        //   }
          
        
        //   const userId = dataset.UpdatedBy;



        //   const review_res = `<div>
        //   <h2>Reviewer Feedback</h2>
        //   <p>User with id ${uploaderId}</p>
        //   <p>Your file was reviewed. Please visit http://www.vectoratlas.icipe.org/review?dataset=${datasetId}</p>
        //   </div>`;
        //   this.mailerService.sendMail({
        //     to: process.env.UPLOADER,
        //     from: 'reviewer@email.com',
        //     subject: 'Reviewer Feedback',
        //     text: 'Some text typed by reviewer',
        //   })

        //   await this.datasetRepository.update(
        //     {id:datasetId},
        //     {status:'In review'});
          
        //    return review_res;
        //   }
          // else 
          // if(!datasetId){
          //   throw new HttpException('Not a valid dataset id', 500);
          // }
      }catch (e) {
        this.logger.error(e);
        throw e;
      }
    }

}
