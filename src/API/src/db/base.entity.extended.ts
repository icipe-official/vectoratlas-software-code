import { Field, ObjectType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from './doi/util';

@ObjectType()
export abstract class BaseEntityExtended extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  owner?: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: false })
  creation?: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  updater?: string;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: false })
  modified?: Date;

  @BeforeInsert()
  beforeInsert?() {
    this.id = uuidv4();
    this.owner = getCurrentUser();
    this.updater = getCurrentUser();
  }

  @BeforeUpdate()
  beforeUpdate?() {
    this.updater = getCurrentUser();
  }
}
