import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('species')
@ObjectType({ description: 'species data' })
export class Species extends BaseEntity{
  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: false })
  species_1: string;

  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  ss_sl: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  assi: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  assi_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: false })
  species_2: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_1: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_2: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_3: string;

  // Associations

  @OneToMany(() => Bionomics, bionomics => bionomics.species)
  bionomics: Bionomics[]

  @OneToMany(() => Occurrence, occurrence => occurrence.species)
  occurrence: Occurrence[]
}