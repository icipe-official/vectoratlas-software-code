import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('gste2_114GenotypeFrequencies')
@ObjectType({ description: 'gste2_114GenotypeFrequencies data' })
export class Gste2_114GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114I.gste2_114I_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114I.gste2_114I_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114I.gste2_114t_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114I.gste2_114t_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114t.gste2_114t_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'gste2_114t.gste2_114t_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.gste2_114GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
