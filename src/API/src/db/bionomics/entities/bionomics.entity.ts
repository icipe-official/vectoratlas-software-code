import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Reference } from '../../shared/entities/reference.entity';
import { Site } from '../../shared/entities/site.entity';
import { Species } from '../../shared/entities/species.entity';
import { Biology } from './biology.entity';
import { Infection } from './infection.entity';
import { BitingRate } from './biting_rate.entity';
import { AnthropoZoophagic } from './anthropo_zoophagic.entity';
import { EndoExophagic } from './endo_exophagic.entity';
import { BitingActivity } from './biting_activity.entity';
import { EndoExophily } from './endo_exophily.entity';

@Entity('bionomics')
@ObjectType({ description: 'bionomics data' })
export class Bionomics extends BaseEntity{
  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  adult_data: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  larval_site_data: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  contact_authors: boolean;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  contact_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  secondary_info: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  insecticide_control: boolean;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  control: string;

  @Column('varchar', { length: 10485760, nullable: true })
  @Field({ nullable: true })
  control_notes: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_end: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_end: number;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  season_given: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  season_calc: string;

  @Column('varchar', { length: 10485760, nullable: true })
  @Field({ nullable: true })
  season_notes: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  data_abstracted_by: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  data_checked_by: string;

  // Associations

  @ManyToOne(() => Reference, reference => reference.bionomics,
    {eager: true, cascade: true, nullable: false})
  reference: Reference

  @ManyToOne(() => Site, site => site.bionomics,
    {eager: true, cascade: true, nullable: false})
  site: Site

  @ManyToOne(() => Species, species => species.bionomics,
    {eager: true, cascade: true, nullable: false})
  species: Species

  @OneToOne(() => Biology, biology => biology.bionomics,
    {eager: true, cascade: true, nullable: true})
  @JoinColumn()
  biology: Promise<Biology>

  @OneToOne(() => Infection, infection => infection.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
  infection: Promise<Infection>

  @OneToOne(() => BitingRate, biting_rate => biting_rate.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
  biting_rate: Promise<BitingRate>

  @OneToOne(() => AnthropoZoophagic, anthropo_zoophagic => anthropo_zoophagic.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
  anthropo_zoophagic: Promise<AnthropoZoophagic>

  @OneToOne(() => EndoExophagic, endo_exophagic => endo_exophagic.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
  endo_exophagic: Promise<EndoExophagic>

  @OneToOne(() => BitingActivity, biting_activity => biting_activity.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
  biting_activity: Promise<BitingActivity>

  @OneToOne(() => EndoExophily, endo_exophily => endo_exophily.bionomics,
    {eager: true, cascade: true, nullable: true})
    @JoinColumn()
    endo_exophily: Promise<EndoExophily>
}
