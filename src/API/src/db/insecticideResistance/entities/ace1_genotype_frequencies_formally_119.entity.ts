import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('ace1_genotype_frequencies_formally_119')
@ObjectType({
  description: 'ACE1 genotype frequencies (formally 119)',
})
export class Ace1GenotypeFrequenciesFormally119 extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_number_of_mosquitoes_tested: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280g_ace1_280g_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280g_ace1_280g_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280g_ace1_280s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280g_ace1_280s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280s_ace1_280s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ace1_280s_ace1_280s_percent: string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.ace1GenotypeFrequenciesFormally119,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays[];
}
