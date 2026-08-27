import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ObjectType,
  Field,
  InputType,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EmailRegistryService } from './email-registry.service';
import { EmailRegistry } from './entities/email-registry.entity';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { Role } from 'src/auth/user_role/role.enum';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { UnsubscribeEmailDto } from './dto/unsubscribe-email.dto';

@ObjectType()
class RegistryMeta {
  @Field(() => Int) page: number;
  @Field(() => Int) limit: number;
  @Field(() => Int) total: number;
  @Field(() => Int) totalPages: number;
}

@ObjectType()
class RegistryPaginatedResponse {
  @Field(() => [EmailRegistry]) data: EmailRegistry[];
  @Field(() => RegistryMeta) meta: RegistryMeta;
}

@InputType()
class ManualRegistryInput {
  @Field() email: string;
  @Field({ nullable: true }) first_name?: string;
  @Field({ nullable: true }) last_name?: string;
}

@Resolver(() => EmailRegistry)
export class EmailRegistryResolver {
  constructor(private readonly service: EmailRegistryService) {}

  @Query(() => RegistryPaginatedResponse, { name: 'adminEmailRegistry' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getRegistry(
    @Args('page', { nullable: true, type: () => Int }) page?: number,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('status', { nullable: true }) status?: string,
  ) {
    return this.service.findAll({ page, limit, search, status });
  }

  @Mutation(() => EmailRegistry, { name: 'adminAddEmailRegistry' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async addManual(@Args('input') input: ManualRegistryInput) {
    return this.service.createManual(input);
  }

  @Mutation(() => String, { name: 'queueDatasetCampaign' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async queueCampaign(
    @Args('title') title: string,
    @Args('message') message: string,
    @Args('datasetUrl') datasetUrl: string,
  ) {
    const result = await this.service.queueDatasetCampaign(
      title,
      message,
      datasetUrl,
    );
    return `Queued ${result.sent} emails for delivery`;
  }

  @Mutation(() => String, { name: 'queueNewsCampaign' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async queueNews(
    @Args('title') title: string,
    @Args('message') message: string,
    @Args('newsUrl', { nullable: true }) newsUrl?: string,
  ) {
    const result = await this.service.queueNewsCampaign(
      title,
      message,
      newsUrl,
    );
    return `Queued ${result.sent} emails for delivery`;
  }

  @Mutation(() => Boolean, { name: 'unsubscribeEmail' })
  async unsubscribe(@Args('payload') payload: UnsubscribeEmailDto): Promise<boolean> {
    await this.service.unsubscribe(payload);
    return true;
  }
}
