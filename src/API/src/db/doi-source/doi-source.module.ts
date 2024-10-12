import { Module } from '@nestjs/common';
import { DoiSourceService } from './doi-source.service';
import { DoiSourceController } from './doi-source.controller';
// import { UploadedDatasetModule } from '../uploaded-dataset/uploaded-dataset.module';

@Module({
  // imports: [UploadedDatasetModule],
  controllers: [DoiSourceController],
  providers: [DoiSourceService],
})
export class DoiSourceModule {}
