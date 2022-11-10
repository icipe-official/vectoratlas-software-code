import { Args, ArgsType, Field, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ReferenceService } from './reference.service';
import { Reference } from './entities/reference.entity';
import PaginatedResponse from '../../pagination/pagination';
import { Min, Max } from '@nestjs/class-validator';
import { integerTypeResolver } from '../occurrence/occurrence.resolver';

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
}

@Resolver(() => Reference)
export class ReferenceResolver {
  constructor(private referenceService: ReferenceService) {}

  @Query(() => Reference)
  async referenceData(@Args('id', { type: () => String }) id: string) {
    return this.referenceService.findOneById(id);
  }

  @Query(() => PaginatedReferenceData)
  async allReferenceData(@Args() { take, skip }: GetReferenceDataArgs) {
    const { items, total } = await this.referenceService.findReferences(
      take,
      skip,
    );
    return Object.assign(new PaginatedReferenceData(), {
      items,
      total,
      hasMore: total > take + skip,
    });
  }
}
