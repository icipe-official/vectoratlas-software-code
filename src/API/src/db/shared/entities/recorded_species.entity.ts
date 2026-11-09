import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';
import { Species } from '../../species/entities/species.entity';

@Entity('recorded_species')
@ObjectType({
  description: 'recorded species data (link to species reference)',
})
export class RecordedSpecies extends BaseEntity {
  // FK -> species.id (species.id = species name, like country.id = name)
  @Column('varchar')
  @Field()
  species: string;

  @ManyToOne(() => Species, (species) => species.recorded_species)
  @JoinColumn({ name: 'species' })
  @Field(() => Species, { nullable: true })
  speciesDetails: Species;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  species_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  species_id_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  species_id_2: string;

  // Associations
  @OneToMany(() => Occurrence, (occurrence) => occurrence.recordedSpecies)
  occurrence: Occurrence;
}
