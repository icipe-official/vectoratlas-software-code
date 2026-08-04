import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { News } from './entities/news.entity';
import { NewsTranslation } from './entities/news-translation.entity';
import { NewsService } from './news.service';
import { NewsTranslationService } from './entities/news-translation.service';
import { NewsResolver } from './news.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([News, NewsTranslation])],
  providers: [NewsService, NewsTranslationService, NewsResolver],
  exports: [NewsService, NewsTranslationService, NewsResolver],
})
export class NewsModule {}
