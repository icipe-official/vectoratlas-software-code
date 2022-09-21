import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('biting_activity')
@ObjectType({ description: 'bionomics biting activity data' })
export class BitingActivity extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sampling_nights_no_indoor: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '18_30_21_30_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_30_00_30_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_30_03_30_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_30_06_30_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sampling_nights_no_outdoor: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '18_30_21_30_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_30_00_30_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_30_03_30_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_30_06_30_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sampling_nights_no_combined: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '18_30_21_30_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_30_00_30_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_30_03_30_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_30_06_30_combined': number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, (bionomics) => bionomics.bitingActivity, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
