import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BionomicsService } from './bionomics.service';
import { BionomicsResolver } from './bionomics.resolver';
import { Bionomics } from './entities/bionomics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bionomics])],
  providers: [BionomicsService, BionomicsResolver],
  exports: [BionomicsService],
})
export class BionomicsModule {}
