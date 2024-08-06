import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('rdl296GenotypeFrequencies')
@ObjectType({ description: 'rdl296GenotypeFrequencies data' })
export class Rdl296GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296c_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296g_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296g_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296g.rdl296g_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296g.rdl296g_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c.rdl296s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296s.rdl296s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296s.rdl296s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296g.rdl296s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296g.rdl296s_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.rdl296GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
