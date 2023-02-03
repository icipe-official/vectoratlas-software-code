import { Logger, Module } from '@nestjs/common';
import { IngestService } from 'src/ingest/ingest.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, IngestService, Logger],
  imports: [],
  exports: [ReviewService],  
})
export class ReviewModule {}
