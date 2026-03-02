import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('biting_activity')
@ObjectType({ description: 'bionomics biting activity data' })
export class BitingActivity extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  biting_activity_indoor_number_of_sampling_nights: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1800_1900_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1900_2000_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2000_2100_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2100_2200_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2200_2300_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2300_0000_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0000_0100_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0100_0200_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0200_0300_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0300_0400_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0400_0500_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0500_0600_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1830_2130_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2130_0030_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0030_0330_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0330_0630_in': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  biting_activity_outdoor_number_of_sampling_nights: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1800_1900_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1900_2000_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2000_2100_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2100_2200_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2200_2300_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2300_0000_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0000_0100_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0100_0200_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0200_0300_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0300_0400_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0400_0500_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0500_0600_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1830_2130_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2130_0030_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0030_0330_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0330_0630_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  biting_activity_combined_number_of_sampling_nights: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1800_1900_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1900_2000_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2000_2100_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2100_2200_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2200_2300_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2300_0000_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0000_0100_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0100_0200_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0200_0300_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0300_0400_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0400_0500_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0500_0600_out': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '1830_2130_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '2130_0030_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0030_0330_combined': number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  '0330_0630_combined': number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  biting_notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.bitingActivity, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
