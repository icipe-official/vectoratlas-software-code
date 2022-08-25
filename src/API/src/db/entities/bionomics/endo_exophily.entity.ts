import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('endo_exophily')
@ObjectType({ description: 'bionomics endo/exophily data' })
export class EndoExophily extends BaseEntity{
  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  resting_sampling_indoor: string;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_indoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  fed_indoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_indoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  total_indoor: number;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  resting_sampling_outdoor: string;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_outdoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  fed_outdoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_outdoor: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  total_outdoor: number;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  resting_sampling_other: string;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_other: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  fed_other: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_other: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  total_other: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  resting_unit: string;

  @Column('varchar', { length: 10485760, nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.endo_exophily,
  {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}
