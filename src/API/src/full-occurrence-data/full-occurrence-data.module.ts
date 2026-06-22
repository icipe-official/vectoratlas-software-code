import { Module } from '@nestjs/common';
import { FullOccurrenceDataController } from './full-occurrence-data.controller';

@Module({
  controllers: [FullOccurrenceDataController],
})
export class FullOccurrenceDataModule {}
