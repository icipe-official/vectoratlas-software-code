import { Field } from "@nestjs/graphql";
import { PrimaryColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 256 })
  @Field({nullable: false})
  id: string
}