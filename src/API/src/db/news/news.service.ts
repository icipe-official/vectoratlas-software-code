import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async newsById(id: string): Promise<News> {
    return await this.newsRepository.findOne({
      where: { id: id },
    });
  }

  async allNews(): Promise<News[]> {
    return await this.newsRepository.find();
  }

  async upsertNews(info: News) {
    return await this.newsRepository.save(info);
  }
}
