import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgsc402GenotypeFrequencies')
@ObjectType({ description: 'vgsc402GenotypeFrequencies data' })
export class Vgsc402GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402v.vgsc402v_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402v.vgsc402v_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402v.vgsc402l_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402v.vgsc402l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402l.vgsc402l_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402l.vgsc402l_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc402GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
