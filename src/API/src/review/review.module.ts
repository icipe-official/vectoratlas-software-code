import { Logger, Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, Logger],
  imports: [],
  exports: [ReviewService],  
})
export class ReviewModule {}
