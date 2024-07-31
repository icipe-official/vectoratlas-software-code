import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('cyp6aapGenotypeFrequencies')
@ObjectType({ description: 'cyp6aapGenotypeFrequencies data' })
export class Cyp6aapGenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.wt.cyp6aap.wt_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.wt.cyp6aap.wt_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.wt.cyp6aap.dup1_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.wt.cyp6aap.dup1_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.dup1.cyp6aap.dup1_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp6aap.dup1.cyp6aap.dup1_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.cyp6aapGenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
