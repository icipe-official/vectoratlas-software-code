import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from './bionomics.entity';

@Entity('environment')
@ObjectType({ description: 'bionomics environment data' })
export class Environment extends BaseEntity {
  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  roof: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  walls: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  house_screening: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  open_eaves: boolean;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  cooking: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  housing_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  occupation: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  outdoor_activities_night: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  sleeping_outdoors: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  community_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  farming: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  farming_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  livestock: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  livestock_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  local_plants: string;

  // Associations

  @OneToOne(() => Bionomics, (bionomics) => bionomics.environment, {
    onDelete: 'CASCADE',
  })
  bionomics: Bionomics;
}
