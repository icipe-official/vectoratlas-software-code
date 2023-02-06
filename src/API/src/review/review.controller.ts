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

@Post('review')
async reviewCsv(
  @AuthUser() user: any,
  @Query('datasetId') datasetId?: string,

){

  if (datasetId) {
    await this.reviewService.reviewDataset(
        datasetId
    )
    }
  }

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Reviewer)
  @Post('approve')
  async approveDataset(
    @AuthUser() user: any,
    @Query('datasetId') datasetId: string){
      try {
        await this.reviewService.approveDataset(datasetId, user.sub)
      } catch (e) {
        throw new HttpException('Approval of dataset failed', 500);
      }
    }
}

