import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRecordedSpeciesInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  color?: string;
}