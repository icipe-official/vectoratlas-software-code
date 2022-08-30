import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bionomics } from 'src/db/bionomics/entities/bionomics.entity';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';

@Module({
  controllers: [IngestController],
  providers: [IngestService],
  imports: [TypeOrmModule.forFeature([Bionomics])]
})
export class IngestModule {}
