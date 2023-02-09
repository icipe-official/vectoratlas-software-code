import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(AuthGuard('va'), RolesGuard)
  @Roles(Role.Reviewer)
  @Post('review')
  async reviewCsv(
    @Query('datasetId') datasetId: string,
    reviewerId: string,
    reviewerFeedback: string,
  ) {
    await this.reviewService.reviewDataset(
      datasetId,
      reviewerId,
      reviewerFeedback,
    );
  }
}
