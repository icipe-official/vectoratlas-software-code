import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('biology')
@ObjectType({ description: 'bionomics biology data' })
export class Biology extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_n: string;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_n: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_total: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  parity_perc: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  daily_survival_rate: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  fecundity: number;

  @Column('float', { nullable: true })
  @Field(() => Float, { nullable: true })
  gonotrophic_cycle_days: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.biology, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
