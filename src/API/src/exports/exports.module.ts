import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ExportJob } from './export-job.entity';
import { ExportsController } from './exports.controller';
import { ExportsService } from './exports.service';
import { ExportsRepository } from './exports.repository';
import { ExportsProcessor } from './exports.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExportJob]),
    BullModule.registerQueue({
      name: 'exports',
    }),
  ],
  controllers: [ExportsController],
  providers: [ExportsService, ExportsRepository, ExportsProcessor],
  exports: [ExportsService],
})
export class ExportsModule { }
