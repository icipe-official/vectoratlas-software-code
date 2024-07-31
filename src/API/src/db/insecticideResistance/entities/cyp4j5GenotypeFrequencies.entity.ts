import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('cyp4j5GenotypeFrequencies')
@ObjectType({ description: 'cyp4j5GenotypeFrequencies data' })
export class Cyp4j5GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43l.cyp4j5_43l_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43l.cyp4j5_43l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43l.cyp4j5_43f_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43l.cyp4j5_43f_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43f.cyp4j5_43f_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5_43f.cyp4j5_43f_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.cyp4j5GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
