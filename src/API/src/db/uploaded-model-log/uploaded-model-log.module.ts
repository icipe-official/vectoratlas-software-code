import { Module } from '@nestjs/common';
import { UploadedModelLogService } from './uploaded-model-log.service';
import { UploadedModelLogController } from './uploaded-model-log.controller';
import { UploadedModelLog } from './entities/uploaded-model-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedModelLog])],
  controllers: [UploadedModelLogController],
  providers: [UploadedModelLogService],
})
export class UploadedModelLogModule {}
