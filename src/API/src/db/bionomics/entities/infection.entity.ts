import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('infection')
@ObjectType({ description: 'bionomics infection data' })
export class Infection extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_infetion_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_infection_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_infection_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_infection_n: string;

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
  sporozoite_rate_by_dissection_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_by_dissection_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sporozoite_rate_by_dissection_percent: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_by_csp_n_pool: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_by_csp_total_pool: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sporozoite_rate_by_csp_percent: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_p_falciparum_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_p_falciparum_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sporozoite_rate_by_p_falciparum_percent: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_p_vivax_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sporozoite_rate_p_vivax_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  sporozoite_rate_by_p_vivax_percent: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  oocyst_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  oocyst_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  oocyst_rate_percent: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  eir: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  eir_period: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  eir_days: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  infection_notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.infection, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
