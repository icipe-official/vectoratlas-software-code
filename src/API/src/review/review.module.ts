import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Dataset } from 'src/db/shared/entities/dataset.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { UploadedDataset } from 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { UploadedDatasetService } from 'src/db/uploaded-dataset/uploaded-dataset.service';
import { CommunicationLogService } from 'src/db/communication-log/communication-log.service';
import { CommunicationLog } from 'src/db/communication-log/entities/communication-log.entity';
import { UploadedDatasetLogService } from 'src/db/uploaded-dataset-log/uploaded-dataset-log.service';
import { UploadedDatasetLog } from 'src/db/uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { DOI } from 'src/db/doi/entities/doi.entity';
import { DoiService } from 'src/db/doi/doi.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [ReviewController],
  providers: [
    ReviewService,
    Logger,
    UploadedDatasetService,
    UploadedDatasetLogService,
    CommunicationLogService,
    DoiService,
    EmailService,
  ],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Dataset,
      UploadedDataset,
      CommunicationLog,
      UploadedDatasetLog,
      DOI,
    ]),
    AuthModule,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
