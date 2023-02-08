import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Dataset)
        private datasetRepository: Repository<Dataset>,
        private logger: Logger,
        private readonly mailerService: MailerService,
        private readonly authService: AuthService,
    ){}

  async reviewDataset(
    datasetId: string,
    reviewerId: string,
    reviewFeedback: string,
  ) {
    try {
      const dataset = await this.datasetRepository.findOne({
        where: { id: datasetId },
      });

      if (dataset == null) {
        throw new HttpException('Not a valid dataset id', 500);
      }

      const userId = dataset.UpdatedBy;

           const emailAddress = await this.authService.getEmailFromUserId(userId);

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

      const uploaderEmail = await this.authService.getEmailFromUserId(uploader);
      const approverEmail = await this.authService.getEmailFromUserId(userId);

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
