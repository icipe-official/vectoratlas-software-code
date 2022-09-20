import { Entity, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Reference } from './reference.entity';

@Entity('species')
@ObjectType({ description: 'constant species data' })
export class Species extends BaseEntity {
  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: false })
  subgenus: string;

  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: false })
  series: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  section: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  complex: string;

  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: true })
  species: string;

  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: true })
  species_author: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year: string;

  // Associations

  @ManyToOne(() => Reference, null, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  reference: Reference;
}
