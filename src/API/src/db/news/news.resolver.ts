import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { NewsService } from './news.service';
import { NewsTranslationService } from './entities/news-translation.service';
import { NewsTranslation } from './entities/news-translation.entity';
import { News } from './entities/news.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { v4 as uuidv4 } from 'uuid';

export const newsClassTypeResolver = () => News;
export const newsListClassTypeResolver = () => [News];

@InputType()
export class CreateNewsInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  title: string;

  @Field()
  summary: string;

  @Field()
  article: string;

  @Field()
  image: string;
}
@InputType()
export class UpsertNewsTranslationInput {
  @Field()
  newsId: string;

  @Field()
  locale: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  summary?: string;

  @Field({ nullable: true })
  article?: string;
}

@Resolver(newsClassTypeResolver)
export class NewsResolver {
  constructor(
    private newsService: NewsService,
    private newsTranslationService: NewsTranslationService,
  ) {}

  @Query(newsClassTypeResolver)
  async newsById(@Args('id', { type: () => String }) id: string) {
    return await this.newsService.newsById(id);
  }

  @Query(newsListClassTypeResolver)
  async allNews() {
    return await this.newsService.allNews();
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Mutation(() => News)
  async createEditNews(
    @Args({
      name: 'input',
      type: () => CreateNewsInput,
      nullable: false,
    })
    input: CreateNewsInput,
  ) {
    const newNews: News = {
      id: input.id ?? uuidv4(),
      ...input,
      lastUpdated: new Date(Date.now()),
    };

    return this.newsService.upsertNews(newNews);
  }
  @ResolveField('title_fr', () => String, { nullable: true })
  async titleFr(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'fr');
    return t?.title;
  }

  @ResolveField('title_pt', () => String, { nullable: true })
  async titlePt(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'pt');
    return t?.title;
  }

  @ResolveField('summary_fr', () => String, { nullable: true })
  async summaryFr(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'fr');
    return t?.summary;
  }

  @ResolveField('summary_pt', () => String, { nullable: true })
  async summaryPt(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'pt');
    return t?.summary;
  }

  @ResolveField('article_fr', () => String, { nullable: true })
  async articleFr(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'fr');
    return t?.article;
  }

  @ResolveField('article_pt', () => String, { nullable: true })
  async articlePt(@Parent() news: News) {
    const t = await this.newsTranslationService.find(news.id, 'pt');
    return t?.article;
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Editor)
  @Mutation(() => NewsTranslation)
  async upsertNewsTranslation(
    @Args({ name: 'input', type: () => UpsertNewsTranslationInput })
    input: UpsertNewsTranslationInput,
  ) {
    return this.newsTranslationService.upsert(input.newsId, input.locale, {
      title: input.title,
      summary: input.summary,
      article: input.article,
    });
  }
}
