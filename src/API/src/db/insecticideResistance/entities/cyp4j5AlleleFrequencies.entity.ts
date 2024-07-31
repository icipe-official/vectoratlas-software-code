import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('cyp4j5AlleleFrequencies')
@ObjectType({ description: 'cyp4j5AlleleFrequencies data' })
export class Cyp4j5AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5.43l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp4j5.43f_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.cyp4j5AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
