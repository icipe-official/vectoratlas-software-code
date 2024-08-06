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
import { Reference } from '../../shared/entities/reference.entity';
import { Site } from '../../shared/entities/site.entity';
import { RecordedSpecies } from '../../shared/entities/recorded_species.entity';
import { Biology } from './biology.entity';
import { Infection } from './infection.entity';
import { BitingRate } from './biting_rate.entity';
import { AnthropoZoophagic } from './anthropo_zoophagic.entity';
import { EndoExophagic } from './endo_exophagic.entity';
import { BitingActivity } from './biting_activity.entity';
import { EndoExophily } from './endo_exophily.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';
import { Environment } from './environment.entity';
import { Dataset } from '../../shared/entities/dataset.entity';
import { LarvalSite } from './larval_site.entity';

@Entity('bionomics')
@Index([
  'site.id',
  'reference.id',
  'month_start',
  'month_end',
  'year_start',
  'year_end',
])
@ObjectType({ description: 'bionomics data' })
export class Bionomics extends BaseEntity {
  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  adult_data: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  larval_site_data: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  study_sampling_design: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  contact_authors: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  contact_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  secondary_info: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  insecticide_control: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  itn_use: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  control: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  control_notes: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_start: number;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  timestamp_start: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_end: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_end: number;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  timestamp_end: Date;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  season_given: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  season_calc: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rainfall_time: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  season_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  data_abstracted_by: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  data_checked_by: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  ir_data: string;

  // Associations
  @ManyToOne(() => Reference, (reference) => reference.bionomics, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  reference: Reference;

  @ManyToOne(() => Site, (site) => site.bionomics, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  site: Site;

  // @OneToOne(() => RecordedSpecies, null, {
  //   eager: true,
  //   cascade: true,
  //   nullable: false,
  // })
  // @JoinColumn()
  // recordedSpecies: RecordedSpecies;

  @ManyToOne(() => Biology, (biology) => biology.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  biology: Biology;

  @ManyToOne(() => Infection, (infection) => infection.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  infection: Infection;

  @ManyToOne(() => BitingRate, (biting_rate) => biting_rate.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  bitingRate: BitingRate;

  @ManyToOne(
    () => AnthropoZoophagic,
    (anthropo_zoophagic) => anthropo_zoophagic.bionomics,
    { eager: true, cascade: true, nullable: true },
  )
  anthropoZoophagic: AnthropoZoophagic;

  @ManyToOne(() => EndoExophagic, (endo_exophagic) => endo_exophagic.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  endoExophagic: EndoExophagic;

  @ManyToOne(
    () => BitingActivity,
    (biting_activity) => biting_activity.bionomics,
    { eager: true, cascade: true, nullable: true },
  )
  bitingActivity: BitingActivity;

  @ManyToOne(() => EndoExophily, (endo_exophily) => endo_exophily.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  endoExophily: EndoExophily;

  @ManyToOne(() => Environment, (environment) => environment.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  environment: Environment;

  @ManyToOne(() => LarvalSite, (LarvalSite) => LarvalSite.bionomics, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  LarvalSite: LarvalSite;

  @OneToMany(() => Occurrence, (occurrence) => occurrence.bionomics, {
    eager: true,
    cascade: false,
    nullable: true,
  })
  occurrence: Occurrence;

  @ManyToOne(() => Dataset, (dataset) => dataset.bionomics, {
    eager: true,
    cascade: ['insert', 'update'],
    nullable: false,
  })
  dataset: Dataset;
}
