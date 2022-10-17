import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceResolver } from './occurrence.resolver';
import { Occurrence } from './entities/occurrence.entity';
import { SiteService } from '../shared/site.service';
import { Site } from '../shared/entities/site.entity';
import { SampleService } from './sample.service';
import { Sample } from './entities/sample.entity';
import { typeOrmModuleOptions } from '../datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([Occurrence, Site, Sample]),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
  ],
  providers: [
    OccurrenceService,
    OccurrenceResolver,
    SiteService,
    SampleService,
  ],
  exports: [OccurrenceService, SiteService, SampleService],
})
export class OccurrenceModule {}
