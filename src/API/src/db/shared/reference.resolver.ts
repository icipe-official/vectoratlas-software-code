import { v4 as uuidv4 } from 'uuid';
import {
  InputType,
  Mutation,
  Args,
  Field,
  Query,
  Resolver,
  ObjectType,
  ArgsType,
} from '@nestjs/graphql';
import { ReferenceService } from './reference.service';
import { UseGuards } from '@nestjs/common';
import { Reference } from './entities/reference.entity';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';
import { RolesGuard } from 'src/auth/user_role/roles.guard';
import PaginatedResponse from '../../pagination/pagination';
import { Min, Max } from '@nestjs/class-validator';
import {
  integerTypeResolver,
  stringTypeResolver,
} from '../occurrence/occurrence.resolver';

@InputType()
export class CreateReferenceInput {
  @Field()
  author: string;

  @Field()
  journal_title: string;

  @Field()
  citation: string;

  @Field()
  report_type: string;

  @Field()
  year: number;

  @Field()
  published: boolean;

  @Field()
  v_data: boolean;
}

@ObjectType()
class PaginatedReferenceData extends PaginatedResponse(Reference) {}

@ArgsType()
export class GetReferenceDataArgs {
  @Field(integerTypeResolver, { nullable: true, defaultValue: 1 })
  @Min(1)
  @Max(100)
  take: number;

  @Field(integerTypeResolver, { nullable: true, defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(stringTypeResolver, { nullable: true, defaultValue: 'num_id' })
  @Min(0)
  orderBy: string;

  @Field(stringTypeResolver, { nullable: true, defaultValue: 'asc' })
  @Min(0)
  order: 'ASC' | 'DESC';

  @Field(integerTypeResolver, { nullable: true, defaultValue: 1 })
  @Min(1)
  startId: number;

  @Field(integerTypeResolver, { nullable: true, defaultValue: null })
  @Min(1)
  endId: number;

  @Field(stringTypeResolver, { nullable: true, defaultValue: '' })
  @Min(0)
  textFilter: string;
}

@Resolver(() => Reference)
export class ReferenceResolver {
  constructor(private referenceService: ReferenceService) {}

  @Query(() => Reference)
  async referenceData(@Args('id', { type: () => String }) id: string) {
    return this.referenceService.findOneById(id);
  }

  @Query(() => PaginatedReferenceData)
  async allReferenceData(
    @Args() { take, skip, orderBy, order, startId, endId, textFilter }: GetReferenceDataArgs,
  ) {
    const { items, total } = await this.referenceService.findReferences(
      take,
      skip,
      orderBy,
      order, startId, endId, textFilter
    );
    return Object.assign(new PaginatedReferenceData(), {
      items,
      total,
      hasMore: total > take + skip,
    });
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.Uploader)
  @Mutation(() => Reference)
  async createReference(
    @Args({ name: 'input', type: () => CreateReferenceInput, nullable: false })
    input: CreateReferenceInput,
  ) {
    const newRef: Partial<Reference> = {
      author: input.author,
      article_title: input.citation,
      journal_title: input.journal_title,
      citation: input.citation,
      year: input.year,
      published: input.published,
      report_type: input.report_type,
      v_data: input.v_data,
      id: uuidv4(),
    };
    return this.referenceService.save(newRef);
  }
}
