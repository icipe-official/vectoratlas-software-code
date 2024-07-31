import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('cyp6p4GenotypeFrequencies')
@ObjectType({ description: 'cyp6p4GenotypeFrequencies data' })
export class Cyp6p4GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236wt_cyp6p4.236wt_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236wt_cyp6p4.236wt_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236wt_cyp6p4.236m_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236wt_cyp6p4.236m_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236m_cyp6p4.236m_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6p4.236m_cyp6p4.236m_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.cyp6p4GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
