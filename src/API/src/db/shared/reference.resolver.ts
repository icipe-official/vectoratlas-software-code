import { v4 as uuidv4 } from 'uuid';
import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReferenceService } from './reference.service';
import { UseGuards } from '@nestjs/common';
import { Reference } from './entities/reference.entity';
import { CurrentUser } from 'src/auth/user.decorator';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { Roles } from 'src/auth/user_role/roles.decorator';
import { Role } from 'src/auth/user_role/role.enum';

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

  @UseGuards(GqlAuthGuard)
  @Roles(Role.Uploader)
  @Mutation(() => Reference)
  async createReference(@CurrentUser() user: any,
  @Args({ name: 'input', type: () => CreateReferenceInput, nullable: false }) input: CreateReferenceInput) {
    console.log(user)
    const newRef: Partial<Reference> = {
      author: input.author,
      article_title: input.citation,
      journal_title: input.journal_title,
      citation: input.citation,
      year: input.year,
      published: input.published,
      id: uuidv4()
    }
    return this.referenceService.save(newRef);
  }
}
