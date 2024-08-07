import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('endo_exophily')
@ObjectType({ description: 'bionomics endo/exophily data' })
export class EndoExophily extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  resting_sampling_indoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_indoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  fed_indoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_indoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  total_indoor: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  resting_sampling_outdoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_outdoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  fed_outdoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_outdoor: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  total_outdoor: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  resting_sampling_other: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  unfed_other: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  fed_other: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  gravid_other: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  total_other: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  resting_unit: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.endoExophily, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
