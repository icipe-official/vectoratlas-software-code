import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('genotypicRepresentativeness')
@ObjectType({ description: 'genotypic Representativeness data' })
export class GenotypicRepresentativeness extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  gen_test_rep_site: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  gen_test_rep_site_dis: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  minor_spec_miss_alle_freq_data: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes_population_rep: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  gen_sample_first_bio_tests: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  gen_sample_link_spec_bio: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  bio_subsample_used_gen_test: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes_on_bioessay_linkage: string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.genotypicRepresentativeness,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
