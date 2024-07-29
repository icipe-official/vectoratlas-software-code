import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgsc402AlleleFrequencies')
@ObjectType({ description: 'vgsc402AlleleFrequencies data' })
export class Vgsc402AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc402v_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc.402l_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc402AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
