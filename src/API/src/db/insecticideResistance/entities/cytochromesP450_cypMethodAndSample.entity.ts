import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('cytochromesP450_cypMethodAndSample')
@ObjectType({ description: 'cytochromesP450_cypMethodAndSample data' })
export class CytochromesP450_cypMethodAndSample extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp_method_1': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp_number_of_mosquitoes_tested': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp_generation': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'cyp_notes': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.cytochromesP450_cypMethodAndSample,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
