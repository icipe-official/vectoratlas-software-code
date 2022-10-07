import { Args, Query, Resolver } from '@nestjs/graphql';
import { ReferenceService } from './reference.service';
import { Reference } from './entities/reference.entity';

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
}
