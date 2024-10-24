import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UploadedDataset } from 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetModule } from 'src/db/uploaded-dataset/uploaded-dataset.module';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, Logger],
  imports: [
    HttpModule,
    UploadedDatasetModule,
    TypeOrmModule.forFeature([Dataset, UploadedDataset]),
    AuthModule,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
