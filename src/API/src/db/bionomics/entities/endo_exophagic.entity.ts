import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('endo_exophagic')
@ObjectType({ description: 'bionomics endo/exophagic data' })
export class EndoExophagic extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sampling_nights_no_indoor: number;

  @Column('varchar', { length: 20, nullable: true })
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
  sampling_nights_no_outdoor: number;

  @Column('varchar', { length: 20, nullable: true })
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

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  biting_unit: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, (bionomics) => bionomics.endo_exophagic, {
    onDelete: 'CASCADE',
  })
  bionomics: Promise<Bionomics>;
}
