import { Entity, Column } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';

@Entity('bionomics')
@ObjectType({ description: 'bionomics data' })
export class Bionomics extends BaseEntity{
  @Column('boolean')
  @Field({ nullable: true })
  adult_data: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  larval_site_data: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  contact_authors: boolean;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  contact_notes: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  secondary_info: string;

  @Column('boolean')
  @Field({ nullable: true })
  insecticide_control: boolean;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  control: string;

  @Column('varchar', { length: 'max' })
  @Field({ nullable: true })
  control_notes: string;

  @Column()
  @Field(() => Int, { nullable: true })
  month_start: number;

  @Column()
  @Field(() => Int)
  year_start: number;

  @Column()
  @Field(() => Int)
  month_end: number;

  @Column()
  @Field(() => Int)
  year_end: number;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  season_given: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  season_calc: string;

  @Column('varchar', { length: 'max' })
  @Field({ nullable: true })
  season_notes: string;

  @Column('varchar', { length: '250' })
  @Field({ nullable: true })
  id_1: string;

  @Column('varchar', { length: '250' })
  @Field({ nullable: true })
  id_2: string;

  @Column('varchar', { length: '250' })
  @Field({ nullable: true })
  data_abstracted_by: string;

  @Column('varchar', { length: '250' })
  @Field({ nullable: true })
  data_checked_by: string;
}
