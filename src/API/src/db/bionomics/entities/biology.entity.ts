import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('biology')
@ObjectType({ description: 'bionomics biology data' })
export class Biology extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_biology_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_biology_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_biology_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_biology_n: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_percent: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  daily_survival_rate_percent: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  fecundity_mean_batch_size: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  gonotrophic_cycle_days: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  biology_notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.biology, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
