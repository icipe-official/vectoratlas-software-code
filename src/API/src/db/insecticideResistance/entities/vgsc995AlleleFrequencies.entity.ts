import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgsc995AlleleFrequencies')
@ObjectType({ description: 'vgsc995AlleleFrequencies data' })
export class Vgsc995AlleleFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'kdr_percent': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc995AlleleFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
