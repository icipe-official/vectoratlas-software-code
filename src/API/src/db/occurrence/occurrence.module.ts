import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceResolver } from './occurrence.resolver';
import { Occurrence } from './entities/occurrence.entity';
import { SiteService } from '../shared/site.service';
import { Site } from '../shared/entities/site.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence, Site])],
  providers: [OccurrenceService, OccurrenceResolver, SiteService],
  exports: [OccurrenceService],
})
export class OccurrenceModule {}
