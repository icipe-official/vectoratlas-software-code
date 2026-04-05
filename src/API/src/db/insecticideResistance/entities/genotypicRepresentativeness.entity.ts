import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('genotypicRepresentativeness')
@ObjectType({ description: 'genotypic Representativeness data' })
export class GenotypicRepresentativeness extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  genotypic_test_representative_of_species_at_site: string;

  @Column({
    name: 'genotypic_repr_species_site_disagg_no_adj',
    type: 'varchar',
    nullable: true,
  })
  genotypic_test_representative_of_species_at_site_if_disaggregated_values_combined_without_adjustments: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  minor_species_missing_allele_frequency_data: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes_on_population_representative: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  genotypic_sample_first_been_through_bioassay_tests: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  genotypic_sample_linked_to_a_specific_bioassay: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  bioassay_subsample_used_in_genotypic_test: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  notes_on_bioassay_linkage: string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.genotypicRepresentativeness,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
