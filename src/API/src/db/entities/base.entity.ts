import { Field } from "@nestjs/graphql";
import { PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string
}