import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('vgscGeneytpeFrequencies')
@ObjectType({ description: 'vgscGeneytpeFrequencies data' })
export class VgscGeneytpeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995l_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995l_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995f_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995f_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.vgsc995f_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.vgsc995f_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995s.vgsc995s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995s.vgsc995s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995.c_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995l.vgsc995c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995c.vgsc995c_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995c.vgsc995c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'null.vgsc995c_or_vgsc995c.vgsc995c_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'null.vgsc995c_or_vgsc995c.vgsc995c_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.s_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.vgsc995s_percent': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.vgsc995c_n': string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  'vgsc995f.vgsc995c_percent': string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgscGeneytpeFrequencies,
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays;
}
