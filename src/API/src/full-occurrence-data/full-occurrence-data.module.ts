import { Module } from '@nestjs/common';
import { FullOccurrenceDataController } from './full-occurrence-data.controller';
import { FullOccurrenceDataService } from './full-occurrence-data.service';

/**
 * API-side module: serves the generated occurrence files and triggers
 * regeneration by spawning the OccurrenceGeoJob CLI as an awaited child
 * process (src/OccurrenceGeoJob), so generation never runs on the API's
 * event loop.
 */
@Module({
  controllers: [FullOccurrenceDataController],
  providers: [FullOccurrenceDataService],
  exports: [FullOccurrenceDataService],
})
export class FullOccurrenceDataModule {}
