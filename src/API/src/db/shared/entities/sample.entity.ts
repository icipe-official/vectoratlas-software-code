import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('sample')
@ObjectType({ description: 'sample data' })
export class Sample extends BaseEntity{
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: false })
  mossamp_tech_1: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_1: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: false })
  mossamp_tech_2: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_2: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: false })
  mossamp_tech_3: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_3: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: false })
  mossamp_tech_4: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_4: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  n_all: number;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: false })
  mos_id_1: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: false })
  mos_id_2: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: false })
  mos_id_3: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: false })
  mos_id_4: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  control: boolean;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: false })
  control_type: string;

  // Associations

  @OneToMany(() => Occurrence, occurrence => occurrence.sample)
  occurrence: Promise<Occurrence[]>
}