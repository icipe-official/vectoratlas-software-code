import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('gsteMethodAndSample')
@ObjectType({ description: 'gsteMethodAndSample data' })
export class GsteMethodAndSample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste_method_1': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste_no_of_mosquitoes_tested': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste_generation': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste_notes': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.gsteMethodAndSample,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
