import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 256 })
  @Field({ nullable: false })
  id: string;
}
