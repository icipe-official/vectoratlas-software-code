import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
import { Vgsc1570GenotypeFrequencies } from './vgsc1570GenotypeFrequencies.entity';
import { Vgsc1570AlleleFrequencies } from './vgsc1570AlleleFrequencies.entity';
import { RdlMethodAndSample } from './rdlMethodAndSample.entity';
import { Rdl296GenotypeFrequencies } from './rdl296GenotypeFrequencies.entity';
import { Rdl296AlleleFrequencies } from './rdl296AlleleFrequencies.entity';
import { Ace1MethodAndSample } from './ace1MethodAndSample.entity';
import { Ace1GenotypeFrequencies } from './ace1GenotypeFrequencies.entity';
import { Ace1AlleleFrequencies } from './ace1AlleleFrequencies.entity';
import { GsteMethodAndSample } from './gsteMethodAndSample.entity';
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
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

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
  @ManyToOne(
    () => GenotypicRepresentativeness,
    (genotypicRepresentativeness) =>
      genotypicRepresentativeness.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  genotypicRepresentativeness: GenotypicRepresentativeness;

  @ManyToOne(
    () => VgscMethodAndSample,
    (vgscMethodAndSample) => vgscMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgscMethodAndSample: VgscMethodAndSample;

  @ManyToOne(
    () => VgscGeneytpeFrequencies,
    (vgscGeneytpeFrequencies) =>
      vgscGeneytpeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgscGeneytpeFrequencies: VgscGeneytpeFrequencies;

  @ManyToOne(
    () => KdrGenotypeFrequencies,
    (kdrGenotypeFrequencies) =>
      kdrGenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  kdrGenotypeFrequencies: KdrGenotypeFrequencies;

  @ManyToOne(
    () => Vgsc995AlleleFrequencies,
    (vgsc995AlleleFrequencies) =>
      vgsc995AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgsc995AlleleFrequencies: Vgsc995AlleleFrequencies;

  @ManyToOne(
    () => Vgsc402GenotypeFrequencies,
    (vgsc402GenotypeFrequencies) =>
      vgsc402GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgsc402GenotypeFrequencies: Vgsc402GenotypeFrequencies;

  @ManyToOne(
    () => Vgsc402AlleleFrequencies,
    (vgsc402AlleleFrequencies) =>
      vgsc402AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgsc402AlleleFrequencies: Vgsc402AlleleFrequencies;

  @ManyToOne(
    () => Cyp6aapAlleleFrequencies,
    (cyp6aapAlleleFrequencies) =>
      cyp6aapAlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp6aapAlleleFrequencies: Cyp6aapAlleleFrequencies;

  @ManyToOne(
    () => Cyp6aapGenotypeFrequencies,
    (cyp6aapGenotypeFrequencies) =>
      cyp6aapGenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp6aapGenotypeFrequencies: Cyp6aapGenotypeFrequencies;

  @ManyToOne(
    () => Cyp6p4AlleleFrequencies,
    (cyp6p4AlleleFrequencies) =>
      cyp6p4AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp6p4AlleleFrequencies: Cyp6p4AlleleFrequencies;

  @ManyToOne(
    () => Cyp6p4GenotypeFrequencies,
    (cyp6p4GenotypeFrequencies) =>
      cyp6p4GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp6p4GenotypeFrequencies: Cyp6p4GenotypeFrequencies;

  @ManyToOne(
    () => Cyp4j5AlleleFrequencies,
    (cyp4j5AlleleFrequencies) =>
      cyp4j5AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp4j5AlleleFrequencies: Cyp4j5AlleleFrequencies;

  @ManyToOne(
    () => Cyp4j5GenotypeFrequencies,
    (cyp4j5GenotypeFrequencies) =>
      cyp4j5GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cyp4j5GenotypeFrequencies: Cyp4j5GenotypeFrequencies;

  @ManyToOne(
    () => CytochromesP450_cypMethodAndSample,
    (cytochromesP450_cypMethodAndSample) =>
      cytochromesP450_cypMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  cytochromesP450_cypMethodAndSample: CytochromesP450_cypMethodAndSample;

  @ManyToOne(
    () => Gste2_119AlleleFrequencies,
    (gste2_119AlleleFrequencies) =>
      gste2_119AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  gste2_119AlleleFrequencies: Gste2_119AlleleFrequencies;

  @ManyToOne(
    () => Gste2_119GenotypeFrequencies,
    (gste2_119GenotypeFrequencies) =>
      gste2_119GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  gste2_119GenotypeFrequencies: Gste2_119GenotypeFrequencies;

  @ManyToOne(
    () => Gste2_114AlleleFrequencies,
    (gste2_114AlleleFrequencies) =>
      gste2_114AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  gste2_114AlleleFrequencies: Gste2_114AlleleFrequencies;

  @ManyToOne(
    () => Gste2_114GenotypeFrequencies,
    (gste2_114GenotypeFrequencies) =>
      gste2_114GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  gste2_114GenotypeFrequencies: Gste2_114GenotypeFrequencies;

  @ManyToOne(
    () => Vgsc1570GenotypeFrequencies,
    (vgsc1570GenotypeFrequencies) =>
      vgsc1570GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgsc1570GenotypeFrequencies: Vgsc1570GenotypeFrequencies;

  @ManyToOne(
    () => Vgsc1570AlleleFrequencies,
    (vgsc1570AlleleFrequencies) =>
      vgsc1570AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  vgsc1570AlleleFrequencies: Vgsc1570AlleleFrequencies;

  @ManyToOne(
    () => RdlMethodAndSample,
    (rdlMethodAndSample) => rdlMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  rdlMethodAndSample: RdlMethodAndSample;

  @ManyToOne(
    () => Rdl296GenotypeFrequencies,
    (rdl296GenotypeFrequencies) =>
      rdl296GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  rdl296GenotypeFrequencies: Rdl296GenotypeFrequencies;

  @ManyToOne(
    () => Rdl296AlleleFrequencies,
    (rdl296AlleleFrequencies) =>
      rdl296AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  rdl296AlleleFrequencies: Rdl296AlleleFrequencies;

  @ManyToOne(
    () => Ace1MethodAndSample,
    (ace1MethodAndSample) => ace1MethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  ace1MethodAndSample: Ace1MethodAndSample;

  @ManyToOne(
    () => Ace1GenotypeFrequencies,
    (ace1GenotypeFrequencies) =>
      ace1GenotypeFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  ace1GenotypeFrequencies: Ace1GenotypeFrequencies;

  @ManyToOne(
    () => Ace1AlleleFrequencies,
    (ace1AlleleFrequencies) =>
      ace1AlleleFrequencies.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  ace1AlleleFrequencies: Ace1AlleleFrequencies;

  @ManyToOne(
    () => GsteMethodAndSample,
    (gsteMethodAndSample) => gsteMethodAndSample.insecticideResistanceBioassays,
    {
      eager: true,
      cascade: true,
      nullable: true,
    },
  )
  gsteMethodAndSample: GsteMethodAndSample;

  @OneToMany(() => Occurrence, (occurrence) => occurrence.sample, {
    onDelete: 'CASCADE',
  })
  occurrence: Occurrence;
}
