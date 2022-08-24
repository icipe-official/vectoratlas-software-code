import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';

@Entity('endo_exophagic')
@ObjectType({ description: 'bionomics endo/exophagic data' })
export class EndoExophagic extends BaseEntity{
  @Column()
  @Field(() => Int)
  sampling_nights_no_indoor: number;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  biting_sampling_indoor: string;

  @Column()
  @Field(() => Float, { nullable: true })
  indoor_biting_n: number;

  @Column()
  @Field(() => Float, { nullable: true })
  indoor_biting_total: number;

  @Column()
  @Field(() => Float, { nullable: true })
  indoor_biting_data: number;

  @Column()
  @Field(() => Int)
  sampling_nights_no_outdoor: number;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  biting_sampling_outdoor: string;

  @Column()
  @Field(() => Float, { nullable: true })
  outdoor_biting_n: number;

  @Column()
  @Field(() => Float, { nullable: true })
  outdoor_biting_total: number;

  @Column()
  @Field(() => Float, { nullable: true })
  outdoor_biting_data: number;

  @Column('varchar', { length: 20 })
  @Field({ nullable: true })
  biting_unit: string;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.endo_exophagic,
  {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}
