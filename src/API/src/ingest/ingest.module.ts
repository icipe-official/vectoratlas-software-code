import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { Reference } from 'src/db/shared/entities/reference.entity';
import { Site } from 'src/db/shared/entities/site.entity';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

@Module({
  controllers: [IngestController],
  providers: [IngestService],
  imports: [TypeOrmModule.forFeature([Bionomics, Reference, Site])]
})
export class IngestModule {}
