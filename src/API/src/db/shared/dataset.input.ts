import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateDatasetInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  dataType?: string;

  @Field(() => String, { nullable: true })
  dataSource?: string;

  @Field(() => String, { nullable: true })
  doi?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  region?: string;
}
