import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('ace1GenotypeFrequencies')
@ObjectType({ description: 'ace1GenotypeFrequencies data' })
export class Ace1GenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280g.ace1_280g_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280g.ace1_280g_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280g.ace1_280s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280g.ace1_280s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280s.ace1_280s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280s.ace1_280s_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.ace1GenotypeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
