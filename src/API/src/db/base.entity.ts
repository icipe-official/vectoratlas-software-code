import { Field } from "@nestjs/graphql";
import { PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field({nullable: false})
  id: string
}