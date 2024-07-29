import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('kdrGenotypeFrequencies')
@ObjectType({ description: 'kdrGenotypeFrequencies data' })
export class KdrGenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'susceptible.susceptible_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'susceptible.susceptible_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant.susceptible_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant.susceptible_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant.resistant_n': string;
  
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'resistant.resistant_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.kdrGenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
