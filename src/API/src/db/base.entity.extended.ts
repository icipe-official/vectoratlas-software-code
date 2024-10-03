import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class BaseEntityExtended extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  owner?: string;

  @CreateDateColumn()
  creation?: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  updater?: string;

  @UpdateDateColumn()
  modified?: Date;

  @BeforeInsert()
  beforeInsert?() {
    this.owner = 'userid';
  }

  @BeforeUpdate()
  beforeUpdate?() {
    this.updater = 'userid';
  }
}
