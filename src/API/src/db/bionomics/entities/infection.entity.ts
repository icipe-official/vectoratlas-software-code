import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('infection')
@ObjectType({ description: 'bionomics infection data' })
export class Infection extends BaseEntity{
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_n: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  ir_by_csp_n_pool: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  ir_by_csp_total_pool: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  no_per_pool: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  ir_by_csp_perc: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_dissection_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_dissection_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sr_by_dissection_perc: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_csp_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_csp_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sr_by_csp_perc: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_pf_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sr_by_pf_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sr_by_p_falciparum: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  oocyst_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  oocyst_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  oocyst_rate: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  eir: number;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  eir_period: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  eir_days: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.infection,
  {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}