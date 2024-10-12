import { Module } from '@nestjs/common';
import { UploadedDatasetLogService } from './uploaded-dataset-log.service';
import { UploadedDatasetLogController } from './uploaded-dataset-log.controller';
import { UploadedDatasetLog } from './entities/uploaded-dataset-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedDatasetLog])],
  controllers: [UploadedDatasetLogController],
  providers: [UploadedDatasetLogService],
  exports: [UploadedDatasetLogService],
})
export class UploadedDatasetLogModule {}
