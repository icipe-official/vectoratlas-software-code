import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgsc1570AlleleFrequencies')
@ObjectType({ description: 'vgsc1570AlleleFrequencies data' })
export class Vgsc1570AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570n_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc1570y_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc1570AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
