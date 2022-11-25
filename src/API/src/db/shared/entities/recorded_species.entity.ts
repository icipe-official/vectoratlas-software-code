import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('recorded_species')
@ObjectType({ description: 'recorded species data' })
export class RecordedSpecies extends BaseEntity {
  @Column('varchar', { length: 20, nullable: true })
  @Field({ nullable: true })
  ss_sl: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  assi: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  assi_notes: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_1: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_2: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  id_method_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  species_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: false })
  species: string;

  // Associations
  @OneToOne(() => Occurrence, (occurrence) => occurrence.recordedSpecies, {
    onDelete: 'CASCADE',
  })
  occurrence: Occurrence[];
}
