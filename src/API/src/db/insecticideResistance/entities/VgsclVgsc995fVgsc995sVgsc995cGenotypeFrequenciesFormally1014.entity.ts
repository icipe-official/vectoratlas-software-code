import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('VgsclVgsc995fVgsc995sVgsc995cGenotypeFrequenciesFormally1014')
@ObjectType({
  description: 'VGSC 995 L/F/S/C genotype frequencies (formally 1014)',
})
export class VgsclVgsc995fVgsc995sVgsc995cGenotypeFrequenciesFormally1014 extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995l_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995l_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995f_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995f_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995f_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995f_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995s_vgsc995s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995s_vgsc995s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995c_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995l_vgsc995c_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995c_vgsc995c_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995c_vgsc995c_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  null_vgsc995c_or_vgsc995c_vgsc995c_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  null_vgsc995c_or_vgsc995c_vgsc995c_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995c_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vgsc995f_vgsc995c_percent: string;

  // Associations
  @OneToMany(
    () => InsecticideResistanceBioassays,
    (insecticideResistanceBioassays) =>
      insecticideResistanceBioassays.vgsc995GenotypeFrequenciesFormally1014, // ✅ must match the @ManyToOne property name
    {
      onDelete: 'CASCADE',
    },
  )
  insecticideResistanceBioassays: InsecticideResistanceBioassays[]; // also note: should be an array
}
