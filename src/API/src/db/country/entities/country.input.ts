import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCountryInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [String], { nullable: true })
  alternative_names?: string[];
}
