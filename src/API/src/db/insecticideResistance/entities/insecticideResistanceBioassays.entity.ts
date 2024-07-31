import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { GenotypicRepresentativeness } from './genotypicRepresentativeness.entity';
import { VgscMethodAndSample } from './vgscMethodAndSample.entity';
import { VgscGeneytpeFrequencies } from './vgscGeneytpeFrequencies.entity';
import { KdrGenotypeFrequencies } from './kdrGenotypeFrequencies.entity';
import { Vgsc995AlleleFrequencies } from './vgsc995AlleleFrequencies.entity';
import { Vgsc402GenotypeFrequencies } from './vgsc402GenotypeFrequencies.entity';
import { Vgsc402AlleleFrequencies } from './vgsc402AlleleFrequencies.entity';
import { Vgsc1570GenotypeFrequencies } from './vgsc1570GenotypeFrequencies.entity';
import { Vgsc1570AlleleFrequencies } from './vgsc1570AlleleFrequencies.entity';
import { RdlMethodAndSample } from './rdlMethodAndSample.entity';
import { Rdl296GenotypeFrequencies } from './rdl296GenotypeFrequencies.entity';
import { Rdl296AlleleFrequencies } from './rdl296AlleleFrequencies.entity';
import { Ace1MethodAndSample } from './ace1MethodAndSample.entity';
import { Ace1GenotypeFrequencies } from './ace1GenotypeFrequencies.entity';
import { Ace1AlleleFrequencies } from './ace1AlleleFrequencies.entity';
import { GsteMethodAndSample } from './gsteMethodAndSample.entity';

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

  @OneToOne(
    () => VgscMethodAndSample,
    (vgscMethodAndSample) => vgscMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgscMethodAndSample: VgscMethodAndSample;

  @OneToOne(
    () => VgscGeneytpeFrequencies,
    (vgscGeneytpeFrequencies) =>
      vgscGeneytpeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgscGeneytpeFrequencies: VgscGeneytpeFrequencies;

  @OneToOne(
    () => VgscGeneytpeFrequencies,
    (kdrGenotypeFrequencies) =>
      kdrGenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  kdrGenotypeFrequencies: KdrGenotypeFrequencies;

  @OneToOne(
    () => Vgsc995AlleleFrequencies,
    (vgsc995AlleleFrequencies) =>
      vgsc995AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgsc995AlleleFrequencies: Vgsc995AlleleFrequencies;

  @OneToOne(
    () => Vgsc402GenotypeFrequencies,
    (vgsc402GenotypeFrequencies) =>
      vgsc402GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgsc402GenotypeFrequencies: Vgsc402GenotypeFrequencies;

  @OneToOne(
    () => Vgsc402AlleleFrequencies,
    (vgsc402AlleleFrequencies) =>
      vgsc402AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgsc402AlleleFrequencies: Vgsc402AlleleFrequencies;

  @OneToOne(
    () => Vgsc1570GenotypeFrequencies,
    (vgsc1570GenotypeFrequencies) =>
      vgsc1570GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgsc1570GenotypeFrequencies: Vgsc1570GenotypeFrequencies;

  @OneToOne(
    () => Vgsc1570AlleleFrequencies,
    (vgsc1570AlleleFrequencies) =>
      vgsc1570AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  vgsc1570AlleleFrequencies: Vgsc1570AlleleFrequencies;

  @OneToOne(
    () => RdlMethodAndSample,
    (rdlMethodAndSample) => rdlMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  rdlMethodAndSample: RdlMethodAndSample;

  @OneToOne(
    () => Rdl296GenotypeFrequencies,
    (rdl296GenotypeFrequencies) =>
      rdl296GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  rdl296GenotypeFrequencies: Rdl296GenotypeFrequencies;

  @OneToOne(
    () => Rdl296AlleleFrequencies,
    (rdl296AlleleFrequencies) =>
      rdl296AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  rdl296AlleleFrequencies: Rdl296AlleleFrequencies;

  @OneToOne(
    () => Ace1MethodAndSample,
    (ace1MethodAndSample) => ace1MethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  ace1MethodAndSample: Ace1MethodAndSample;

  @OneToOne(
    () => Ace1GenotypeFrequencies,
    (ace1GenotypeFrequencies) =>
      ace1GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  ace1GenotypeFrequencies: Ace1GenotypeFrequencies;

  @OneToOne(
    () => Ace1AlleleFrequencies,
    (ace1AlleleFrequencies) =>
      ace1AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  ace1AlleleFrequencies: Ace1AlleleFrequencies;

  @OneToOne(
    () => GsteMethodAndSample,
    (gsteMethodAndSample) => gsteMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  gsteMethodAndSample: GsteMethodAndSample;
}
