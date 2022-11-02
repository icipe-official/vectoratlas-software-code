import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferenceService } from './reference.service';
import { Reference } from './entities/reference.entity';

@InputType()
class CreateReferenceInput {
  @Field()
  author: string

  @Field()
  journal_title: string

  @Field()
  citation: string

  @Field()
  year: number

  @Field()
  published: boolean
}

@Resolver(() => Reference)
export class ReferenceResolver {
  constructor(private referenceService: ReferenceService) {}

  @Query(() => Reference)
  async referenceData(@Args('id', { type: () => String }) id: string) {
    return this.referenceService.findOneById(id);
  }

  @Query(() => [Reference])
  async allReferenceData() {
    return this.referenceService.findAll();
  }

  @Mutation(() => Reference)
  async createReference(@Args({ name: 'input', type: () => CreateReferenceInput, nullable: false }) input: CreateReferenceInput) {
    const newRef: Partial<Reference> = {
      author: input.author,
      article_title: input.citation,
      journal_title: input.journal_title,
      citation: input.citation,
      year: input.year,
      published: input.published
    }
    return this.referenceService.save(newRef);
  }
}
