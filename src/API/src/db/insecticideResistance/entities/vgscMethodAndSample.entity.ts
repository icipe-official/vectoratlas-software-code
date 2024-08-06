import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgscMethodAndSample')
@ObjectType({ description: 'vgscMethodAndSample data' })
export class VgscMethodAndSample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc_method_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc_method_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc_no_of_mosquitors_tested: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc_generation: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc_kdr_notes: string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgscMethodAndSample,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
