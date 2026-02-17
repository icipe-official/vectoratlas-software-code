import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { InsecticideResistanceBioassays } from './insecticideResistanceBioassays.entity';

@Entity('rdl296c_rdl296g_rdl296s_genotype_frequencies')
@ObjectType({
  description: 'RDL 296 C/G/S genotype frequencies',
})
export class Rdl296cRdl296gRdl296sGenotypeFrequencies extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296c__n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296c_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296g_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296g_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296g_rdl296g_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296g_rdl296g_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296c_rdl296s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296s_rdl296s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296s_rdl296s_percent: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296g_rdl296s_n: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  rdl296g_rdl296s_percent: string;

  // Associations
 @OneToMany(
  () => InsecticideResistanceBioassays,
  (insecticideResistanceBioassays) =>
    insecticideResistanceBioassays.rdl296cRdl296gRdl296sGenotypeFrequencies,
  {
    onDelete: 'CASCADE',
  },
)
insecticideResistanceBioassays: InsecticideResistanceBioassays[];

}
