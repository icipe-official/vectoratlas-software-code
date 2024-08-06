import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('rdl296AlleleFrequencies')
@ObjectType({ description: 'rdl296AlleleFrequencies data' })
export class Rdl296AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296g_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl296s_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.rdl296AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
