import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsTranslation } from './news-translation.entity';
@Injectable()
export class NewsTranslationService {
  constructor(
    @InjectRepository(NewsTranslation)
    private newsTranslationRepository: Repository<NewsTranslation>,
  ) {}

  async find(newsId: string, locale: string): Promise<NewsTranslation | null> {
    return this.newsTranslationRepository.findOne({
      where: { newsId, locale },
    });
  }

  async upsert(
    newsId: string,
    locale: string,
    data: { title?: string; summary?: string; article?: string },
  ): Promise<NewsTranslation> {
    const existing = await this.find(newsId, locale);
    if (existing) {
      return this.newsTranslationRepository.save({ ...existing, ...data });
    }
    return this.newsTranslationRepository.save({ newsId, locale, ...data });
  }
}
