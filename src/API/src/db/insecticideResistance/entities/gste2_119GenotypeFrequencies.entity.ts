import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('gste2_119GenotypeFrequencies')
@ObjectType({ description: 'gste2_119GenotypeFrequencies data' })
export class Gste2_119GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119l.gste2_119l_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119l.gste2_119l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119l.gste2_119v_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119l.gste2_119v_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119v.gste2_119v_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_119v.gste2_119v_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.gste2_119GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
