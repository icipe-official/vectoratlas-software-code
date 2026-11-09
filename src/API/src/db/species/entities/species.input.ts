import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSpeciesInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  display_name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => [String], { nullable: true })
  alternative_names?: string[];
}
