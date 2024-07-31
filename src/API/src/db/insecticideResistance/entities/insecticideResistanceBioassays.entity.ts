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
import { VgscMethodAndSample } from './vgscMethodAndSample.entity';
import { VgscGeneytpeFrequencies } from './vgscGeneytpeFrequencies.entity';
import { KdrGenotypeFrequencies } from './kdrGenotypeFrequencies.entity';
import { Vgsc995AlleleFrequencies } from './vgsc995AlleleFrequencies.entity';
import { Vgsc402GenotypeFrequencies } from './vgsc402GenotypeFrequencies.entity';
import { Vgsc402AlleleFrequencies } from './vgsc402AlleleFrequencies.entity';
import { Cyp6aapAlleleFrequencies } from './cyp6aapAlleleFrequencies.entity';
import { Cyp6aapGenotypeFrequencies } from './cyp6aapGenotypeFrequencies.entity';
import { Cyp6p4AlleleFrequencies } from './cyp6p4AlleleFrequencies.entity';
import { Cyp4j5AlleleFrequencies } from './cyp4j5AlleleFrequencies.entity';
import { Cyp4j5GenotypeFrequencies } from './cyp4j5GenotypeFrequencies.entity';
import { CytochromesP450_cypMethodAndSample } from './cytochromesP450_cypMethodAndSample.entity';
import { Gste2_119AlleleFrequencies } from './gste2_119AlleleFrequencies.entity';
import { Gste2_119GenotypeFrequencies } from './gste2_119GenotypeFrequencies.entity';
import { Gste2_114AlleleFrequencies } from './gste2_114AlleleFrequencies.entity';
import { Gste2_114GenotypeFrequencies } from './gste2_114GenotypeFrequencies.entity';
import { Cyp6p4GenotypeFrequencies } from './cyp6p4GenotypeFrequencies.entity';

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
    () => Cyp6aapAlleleFrequencies,
    (cyp6aapAlleleFrequencies) =>
      cyp6aapAlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp6aapAlleleFrequencies: Cyp6aapAlleleFrequencies;

  @OneToOne(
    () => Cyp6aapGenotypeFrequencies,
    (cyp6aapGenotypeFrequencies) =>
      cyp6aapGenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp6aapGenotypeFrequencies: Cyp6aapGenotypeFrequencies;

  @OneToOne(
    () => Cyp6p4AlleleFrequencies,
    (cyp6p4AlleleFrequencies) =>
      cyp6p4AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp6p4AlleleFrequencies: Cyp6p4AlleleFrequencies;

  @OneToOne(
    () => Cyp6p4GenotypeFrequencies,
    (cyp6p4GenotypeFrequencies) =>
      cyp6p4GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp6p4GenotypeFrequencies: Cyp6p4GenotypeFrequencies;

  @OneToOne(
    () => Cyp4j5AlleleFrequencies,
    (cyp4j5AlleleFrequencies) =>
      cyp4j5AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp4j5AlleleFrequencies: Cyp4j5AlleleFrequencies;

  @OneToOne(
    () => Cyp4j5GenotypeFrequencies,
    (cyp4j5GenotypeFrequencies) =>
      cyp4j5GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cyp4j5GenotypeFrequencies: Cyp4j5GenotypeFrequencies;

  @OneToOne(
    () => CytochromesP450_cypMethodAndSample,
    (cytochromesP450_cypMethodAndSample) =>
      cytochromesP450_cypMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  cytochromesP450_cypMethodAndSample: CytochromesP450_cypMethodAndSample;

  @OneToOne(
    () => Gste2_119AlleleFrequencies,
    (gste2_119AlleleFrequencies) =>
      gste2_119AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  gste2_119AlleleFrequencies: Gste2_119AlleleFrequencies;

  @OneToOne(
    () => Gste2_119GenotypeFrequencies,
    (gste2_119GenotypeFrequencies) =>
      gste2_119GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  gste2_119GenotypeFrequencies: Gste2_119GenotypeFrequencies;

  @OneToOne(
    () => Gste2_114AlleleFrequencies,
    (gste2_114AlleleFrequencies) =>
      gste2_114AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  gste2_114AlleleFrequencies: Gste2_114AlleleFrequencies;

  @OneToOne(
    () => Gste2_114GenotypeFrequencies,
    (gste2_114GenotypeFrequencies) =>
      gste2_114GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  @JoinColumn()
  gste2_114GenotypeFrequencies: Gste2_114GenotypeFrequencies;
}
