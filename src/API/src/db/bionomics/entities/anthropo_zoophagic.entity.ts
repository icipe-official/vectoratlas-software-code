import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('anthropo_zoophagic')
@ObjectType({ description: 'bionomics anthropo/zoophagic data' })
export class AnthropoZoophagic extends BaseEntity{
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_indoor: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  indoor_host_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_host_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_host_perc: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_outdoor: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  outdoor_host_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_host_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_host_perc: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_combined_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_combined_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_combined_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_combined_n: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  combined_host_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  combined_host_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  combined_host: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_unit: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_other_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_other_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_other_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_sampling_other_n: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  other_host_n: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  other_host_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  host_other: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  host_other_unit: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.bitingRate,
  {onDelete: 'CASCADE'} )
  bionomics: Bionomics
}
