import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Reference } from './entities/reference.entity';
import { RecordedSpecies } from './entities/recorded_species.entity';

@Entity('species')
@ObjectType({ description: 'constant species data' })
export class Species extends BaseEntity {
  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: false })
  subgenus: string;

  @Column('varchar', { length: 50, nullable: true })
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

  @Column('varchar', { length: 250, nullable: false })
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

  @OneToMany(
    () => RecordedSpecies,
    (recorded_species) => recorded_species.species,
    {
      eager: true,
      cascade: true,
      nullable: false,
    },
  )
  recordedSpecies: RecordedSpecies[];
}
