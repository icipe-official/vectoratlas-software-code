import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, HttpException, Post, Query, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/user.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
    constructor(
        private reviewService: ReviewService,
        private readonly mailerService: MailerService,) {}
/* @UseGuards(AuthGuard('va'), RolesGuard)
@Roles(Role.Reviewer) */
@Post('review')
async reviewCsv(
  @AuthUser() user: any,
  @Query('datasetId') datasetId?: string,
  //@Body('reviewFeedback')reviewFeedback?:string
){
  //const userId = user.sub;
  if (datasetId) {
/*     if (!(await this.ingestService.validDataset(datasetId))) {
      throw new HttpException('No dataset exists with this id.', 403);
    } */
    await this.reviewService.reviewDataset(
        datasetId
    )
    }
/*   const response = `<div>
  <h2>Reviewer Feedback</h2>
  <p>Your file was reviewed. Please visit http://www.vectoratlas.icipe.org/review?dataset=${datasetId}</p>
  </div>`;
   this.mailerService.sendMail({
    to: process.env.UPLOADER,
    from: 'reviewer@email.com',
    subject: 'Reviewer Feedback',
    context: {
        reviewFeedback : reviewFeedback
    },
  })

      return response; */
  }

}

