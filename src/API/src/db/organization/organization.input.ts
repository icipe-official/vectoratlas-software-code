import { Organization } from '../organization/entities/organization.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => String, { nullable: true })
  acknowledgement?: string;

  @Field(() => String, { nullable: true })
  terms_and_conditions?: string;
}

@InputType()
export class UpdateOrganizationInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  logo?: string;

  @Field(() => String, { nullable: true })
  acknowledgement?: string;

  @Field(() => String, { nullable: true })
  terms_and_conditions?: string;
}
