import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../base.entity";
import { Reference } from "../shared/reference.entity";
import { Sample } from "../shared/sample.entity";
import { Site } from "../shared/site.entity";
import { Species } from "../shared/species.entity";

@Entity('occurrence')
@ObjectType({ description: 'occurrence data' })
export class Occurrence extends BaseEntity{
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

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  dec_id: string;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  dec_check: string;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  map_check: string;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  vector_notes: string;

  // Associations

  @ManyToOne(() => Reference, reference => reference.occurrence,
    {eager: true, cascade: true, nullable: false})
  reference: Promise<Reference>

  @ManyToOne(() => Site, site => site.occurrence,
    {eager: true, cascade: true, nullable: false})
  site: Promise<Site>

  @ManyToOne(() => Species, species => species.occurrence,
    {eager: true, cascade: true, nullable: false})
  species: Promise<Species>

  @ManyToOne(() => Sample, sample => sample.occurrence,
    {eager: true, cascade: true, nullable: false})
  sample: Promise<Sample>
}