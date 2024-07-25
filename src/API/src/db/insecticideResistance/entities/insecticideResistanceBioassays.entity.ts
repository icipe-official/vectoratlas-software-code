import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { GenotypicRepresentativeness } from './genotypicRepresentativeness.entity';

@Entity('insecticideResistanceBioassays')
@ObjectType({ description: 'insecticideResistance data' })
export class InsecticideResistanceBioassays extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  bio_rep_complex_site: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  bio_rep_complex_site_disaggregated: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  generation: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  wild_caught_larvae_adults: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  lower_age_days: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  upper_age_days: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  test_protocal: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  insecticide_tested: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  insecticide_class: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  irac_moa: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  irac_moa_code: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  concentration_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  concentration_microgram: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  exposure_period_min: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  intensity_multiplier: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  synergist_tested: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  synergist_concentration: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  synergist_concentration_unit: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  mosquitors_tested_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  mosquitors_dead_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  percent_mortality: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  knock_down_expo_time_min: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  no_mosq_knock_down: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  knock_down_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ktd_50_percent_min: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ktd_90_percent_min: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  ktd_95_percent_min: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  bioassay_notes: string;

  // Associations
  @OneToOne(
    () => GenotypicRepresentativeness,
    (genotypicRepresentativeness) =>
      genotypicRepresentativeness.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  genotypicRepresentativeness: GenotypicRepresentativeness;
}
