import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../base.entity";
import { Reference } from "../../shared/entities/reference.entity";
import { Sample } from "./sample.entity";
import { Site } from "../../shared/entities/site.entity";
import { Species } from "../../shared/entities/species.entity";

@Entity('occurrence')
@ObjectType({ description: 'occurrence data' })
export class Occurrence extends BaseEntity{
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

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  dec_id: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  dec_check: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  map_check: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vector_notes: string;

  // Associations

  @ManyToOne(() => Reference, reference => reference.occurrence,
    {eager: true, cascade: true, nullable: false})
  reference: Reference

  @ManyToOne(() => Site, site => site.occurrence,
    {eager: true, cascade: true, nullable: false})
  site: Site

  @ManyToOne(() => Species, species => species.occurrence,
    {eager: true, cascade: true, nullable: false})
  species: Species

  @OneToOne(() => Sample, sample => sample.occurrence,
    {eager: true, cascade: true, nullable: false})
  @JoinColumn()
  sample: Sample
}