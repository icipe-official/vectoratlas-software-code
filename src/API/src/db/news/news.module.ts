import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService, NewsResolver],
  exports: [NewsService, NewsResolver],
})
export class NewsModule {}
