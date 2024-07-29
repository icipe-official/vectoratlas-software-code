import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('environment')
@ObjectType({ description: 'bionomics environment data' })
export class Environment extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  roof: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  walls: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  house_screening: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  open_eaves: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  cooking: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  housing_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  occupation_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  occupation_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  occupation_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  outdoor_activities_night: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  sleeping_outdoors: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  outdoor_timings_hours: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  outdoor_activities_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  average_bedtime: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  average_waketime: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  leave_home_time: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  hours_away: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  seasonal_labour: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  community_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  forest: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  farming: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  farming_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_4: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_notes: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  local_plants: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  environment_notes: string;

  // Associations

  @OneToOne(() => Bionomics, (bionomics) => bionomics.environment, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
