import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from './occurrence.entity';

@Entity('sample')
@ObjectType({ description: 'sample data' })
export class Sample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_occurrence_1: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  occurrence_n_1: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_occurrence_2: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  occurrence_n_2: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_occurrence_3: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  occurrence_n_3: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  sampling_occurrence_4: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  occurrence_n_4: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  occurrence_n_tot: number;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  control: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  control_type: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  occurrence_notes: string;

  // Associations

  @OneToMany(() => Occurrence, (occurrence) => occurrence.sample, {
    onDelete: 'CASCADE',
  })
  occurrence: Occurrence;
}
