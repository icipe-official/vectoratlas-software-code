import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BionomicsService } from './bionomics.service';
import { BionomicsResolver } from './bionomics.resolver';
import { Bionomics } from './entities/bionomics.entity';
import { BionomicsSearchController } from './bionomics-search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bionomics])],
  providers: [BionomicsService, BionomicsResolver],
  exports: [BionomicsService],
  controllers: [BionomicsSearchController],
})
export class BionomicsModule {}
