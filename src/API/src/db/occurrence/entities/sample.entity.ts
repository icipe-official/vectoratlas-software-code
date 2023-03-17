import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from './occurrence.entity';

@Entity('sample')
@ObjectType({ description: 'sample data' })
export class Sample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  mossamp_tech_1: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_1: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  mossamp_tech_2: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_2: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  mossamp_tech_3: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_3: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  mossamp_tech_4: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_4: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_all: number;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  control: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  control_type: string;

  // Associations

  @OneToOne(() => Occurrence, (occurrence) => occurrence.sample)
  occurrence: Occurrence;
}
