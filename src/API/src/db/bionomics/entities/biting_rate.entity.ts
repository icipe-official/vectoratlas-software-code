import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('biting_rate')
@ObjectType({ description: 'bionomics biting rate data' })
export class BitingRate extends BaseEntity{
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_indoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_hbr: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_outdoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_hbr: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_combined_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_combined_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_combined_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_sampling_combined_n: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  combined_hbr: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  hbr_unit: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  abr_sampling_combined_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  abr_sampling_combined_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  abr_sampling_combined_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  abr_sampling_combined_n: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  abr: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  abr_unit: string;

  @Column('varchar', { length: 10485760, nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.biting_rate,
  {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}