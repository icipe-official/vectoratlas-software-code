import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';
import { Occurrence } from '../occurrence/occurrence.entity';

@Entity('species')
@ObjectType({ description: 'species data' })
export class Species extends BaseEntity{
  @Column('varchar', { length: 50 })
  @Field({ nullable: false })
  species_1: string;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  ss_sl: string;

  @Column('boolean')
  @Field({ nullable: true })
  assi: boolean;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  assi_notes: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: false })
  species_2: string;

  // Associations

  @OneToMany(() => Bionomics, bionomics => bionomics.species)
  bionomics: Promise<Bionomics[]>

  @OneToMany(() => Occurrence, occurrence => occurrence.species)
  occurrence: Promise<Occurrence[]>
}