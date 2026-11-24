import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateRecordedSpeciesInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  species?: string;

  @Field({ nullable: true })
  species_notes?: string;

  @Field({ nullable: true })
  species_id_1?: string;

  @Field({ nullable: true })
  species_id_2?: string;
}
