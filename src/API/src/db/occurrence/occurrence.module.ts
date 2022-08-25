import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OccurrenceService } from './occurrence.service';
import { OccurrenceResolver } from './occurrence.resolver';
import { Occurrence } from './entities/occurrence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Occurrence])],
  providers: [OccurrenceService, OccurrenceResolver],
  exports: [OccurrenceService],
})
export class OccurrenceModule {}
