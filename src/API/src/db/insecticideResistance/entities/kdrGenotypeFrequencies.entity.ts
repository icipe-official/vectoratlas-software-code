import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('kdrGenotypeFrequencies')
@ObjectType({ description: 'kdrGenotypeFrequencies data' })
export class KdrGenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'susceptible_susceptible_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'susceptible_susceptible_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant_susceptible_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant_susceptible_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant_resistant_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant_resistant_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.kdrGenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
