import { Module } from '@nestjs/common';
import { DynamicQueryService } from './dynamic-query.service';

@Module({
  providers: [DynamicQueryService],
  exports: [DynamicQueryService], // Crucial: allows other modules to use it
})
export class DynamicQueryModule {}
