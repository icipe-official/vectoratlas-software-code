import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('ace1AlleleFrequencies')
@ObjectType({ description: 'ace1AlleleFrequencies data' })
export class Ace1AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280g_wildtype': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'ace1_280s_resistant': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.ace1AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
