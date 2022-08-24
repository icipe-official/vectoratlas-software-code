import { Entity, Column, ManyToOne, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Reference } from '../shared/reference.entity';
import { Site } from '../shared/site.entity';
import { Species } from '../shared/species.entity';
import { Biology } from './biology.entity';
import { Infection } from './infection.entity';
import { BitingRate } from './biting_rate.entity';

@Entity('bionomics')
@ObjectType({ description: 'bionomics data' })
export class Bionomics extends BaseEntity{
  @Column('boolean')
  @Field({ nullable: true })
  adult_data: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  larval_site_data: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  contact_authors: boolean;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  contact_notes: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  secondary_info: string;

  @Column('boolean')
  @Field({ nullable: true })
  insecticide_control: boolean;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  control: string;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  control_notes: string;

  @Column()
  @Field(() => Int, { nullable: true })
  month_start: number;

  @Column()
  @Field(() => Int)
  year_start: number;

  @Column()
  @Field(() => Int)
  month_end: number;

  @Column()
  @Field(() => Int)
  year_end: number;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  season_given: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  season_calc: string;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  season_notes: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  id_1: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  id_2: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  data_abstracted_by: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  data_checked_by: string;

  // Associations

  @ManyToOne(() => Reference, reference => reference.bionomics,
    {eager: true, cascade: true, nullable: false})
  reference: Promise<Reference>

  @ManyToOne(() => Site, site => site.bionomics,
    {eager: true, cascade: true, nullable: false})
  site: Promise<Site>

  @ManyToOne(() => Species, species => species.bionomics,
    {eager: true, cascade: true, nullable: false})
  species: Promise<Species>

  @OneToOne(() => Biology, biology => biology.bionomics,
    {eager: true, cascade: true, nullable: true})
  biology: Promise<Biology>

  @OneToOne(() => Infection, infection => infection.bionomics,
    {eager: true, cascade: true, nullable: true})
  infection: Promise<Infection>

  @OneToOne(() => BitingRate, biting_rate => biting_rate.bionomics,
    {eager: true, cascade: true, nullable: true})
    biting_rate: Promise<BitingRate>
}
