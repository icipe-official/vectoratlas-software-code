import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgsc1570GenotypeFrequencies')
@ObjectType({ description: 'vgsc1570GenotypeFrequencies data' })
export class Vgsc1570GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570n.vgsc1570n_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570n.vgsc1570n_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570n.vgsc1570y_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570n.1570y_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570y.vgsc1570y_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570y.vgsc1570y_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc1570GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
