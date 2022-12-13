import {
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { NewsService } from './news.service';
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

@Resolver(newsClassTypeResolver)
export class NewsResolver {
  constructor(private newsService: NewsService) {}

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
    };

    return this.newsService.upsertNews(newNews);
  }
}
