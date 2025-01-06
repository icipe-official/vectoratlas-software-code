import { Logger, Module } from '@nestjs/common';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

@Module({
  controllers: [DatasetsController],
  providers: [DatasetsService, Logger],
  exports: [DatasetsService],
})
export class DatasetsModule {}
