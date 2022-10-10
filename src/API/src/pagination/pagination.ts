import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export default function PaginatedResponse<TItem>(TItemClass: Type<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // here we use the runtime argument
    @Field(() => [TItemClass])
    // and here the generic type
    items: TItem[];
    @Field(() => Int)
    total: number;
    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseClass;
}
