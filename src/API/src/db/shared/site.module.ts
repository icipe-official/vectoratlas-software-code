import { Module } from '@nestjs/common';
import { OccurrenceModule } from '../occurrence/occurrence.module';
import { SiteSearchController } from './site-search.controller';

@Module({
  imports: [OccurrenceModule],
  controllers: [SiteSearchController],
})
export class SiteModule {}
