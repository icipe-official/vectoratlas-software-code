import { Logger, Module } from '@nestjs/common';
import { ModelProcessingStatus, ModelsResolver } from './models.resolver';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { ModelsTransformationService } from './modelsTransformation.service';

@Module({
  imports: [ModelProcessingStatus],
  controllers: [ModelsController],
  providers: [
    ModelsService,
    ModelsTransformationService,
    ModelsResolver,
    Logger,
  ],
  exports: [ModelsService, ModelsResolver],
})
export class ModelsModule {}
