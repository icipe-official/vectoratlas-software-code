import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';

@Module({
  controllers: [ModelsController],
})
export class ModelsModule {}
