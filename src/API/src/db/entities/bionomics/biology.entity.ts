import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';

@Entity('biology')
@ObjectType({ description: 'bionomics biology data' })
export class Biology extends BaseEntity{
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_3: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  sampling_n: string;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  parity_n: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  parity_total: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  parity_perc: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  daily_survival_rate: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  fecundity: number;

  @Column({ nullable: true })
  @Field(() => Float, { nullable: true })
  gonotrophic_cycle_days: number;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.biology,
    {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}