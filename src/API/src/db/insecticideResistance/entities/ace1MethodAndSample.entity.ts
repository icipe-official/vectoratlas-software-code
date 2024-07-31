import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('ace1MethodAndSample')
@ObjectType({ description: 'ace1MethodAndSample data' })
export class Ace1MethodAndSample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_method_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_no_of_mosquitoes_tested: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_generation: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_notes: string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.ace1MethodAndSample,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
