import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('endo_exophagic')
@ObjectType({ description: 'bionomics endo/exophagic data' })
export class EndoExophagic extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  biting_number_of_sampling_nights_indoors: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  biting_sampling_indoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_biting_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_biting_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  indoor_biting_data: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  biting_number_of_sampling_nights_outdoors: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  biting_sampling_outdoor: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_biting_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_biting_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  outdoor_biting_data: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  indoor_outdoor_biting_unit: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  indoor_outdoor_biting_notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.endoExophagic, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
