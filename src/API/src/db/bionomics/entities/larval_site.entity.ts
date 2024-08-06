import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('Larval_site')
@ObjectType({ description: 'bionomics LarvalSite data' })
export class LarvalSite extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_instars_found_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_habitat_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_site_character_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_turbidity_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_salinity_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_vegetation_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_shade_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_water_current_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_size_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_depth_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_performance_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_other_fauna_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_control_present_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_instars_found_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_habitat_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_site_character_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_turbidity_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_salinity_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_vegetation_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_shade_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_water_current_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_size_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_depth_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_performance_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_other_fauna_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_control_present_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_instars_found_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_habitat_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_site_character_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_tubidity_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_salinity_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_vegetation_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_shade_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_water_current_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_size_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_depth_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_performance_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_other_fauna_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_control_present_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  larval_notes: string;

  // Associations
  @OneToMany(() => Bionomics, (bionomics) => bionomics.LarvalSite, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
