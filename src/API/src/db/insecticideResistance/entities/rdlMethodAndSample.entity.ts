import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('rdlMethodAndSample')
@ObjectType({ description: 'rdlMethodAndSample data' })
export class RdlMethodAndSample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl_method_1': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl_no_of_mosquitoes_tested': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl_generation': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'rdl_notes': string;

  // Associations
  @OneToOne(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.rdlMethodAndSample,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
