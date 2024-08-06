import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
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
  '18_00_19_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '19_00_20_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '20_00_21_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_00_22_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '22_00_23_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '23_00_00_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_00_01_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '01_00_02_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '02_00_03_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_00_04_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '04_00_05_00_indoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '05_00_06_00_indoor': number;

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
  '18_00_19_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '19_00_20_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '20_00_21_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_00_22_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '22_00_23_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '23_00_00_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_00_01_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '01_00_02_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '02_00_03_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_00_04_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '04_00_05_00_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '05_00_06_00_combined': number;

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
  '18_00_19_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '19_00_20_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '20_00_21_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '21_00_22_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '22_00_23_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '23_00_00_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '00_00_01_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '01_00_02_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '02_00_03_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '03_00_04_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '04_00_05_00_outdoor': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '05_00_06_00_outdoor': number;

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

  @OneToMany(() => Bionomics, (bionomics) => bionomics.bitingActivity, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
