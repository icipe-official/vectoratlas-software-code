import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('recorded_species')
@ObjectType({ description: 'recorded species data' })
export class RecordedSpecies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  species: string;

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
  @OneToOne(() => Occurrence, (occurrence) => occurrence.recordedSpecies)
  occurrence: Occurrence;
}
