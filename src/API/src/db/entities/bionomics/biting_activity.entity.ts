import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';

@Entity('biting_activity')
@ObjectType({ description: 'bionomics biting activity data' })
export class BitingActivity extends BaseEntity{
  @Column()
  @Field(() => Int)
  sampling_nights_no_indoor: number;

  @Column()
  @Field(() => Int)
  '18_30_21_30_indoor': number;

  @Column()
  @Field(() => Int)
  '21_30_00_30_indoor': number;

  @Column()
  @Field(() => Int)
  '00_30_03_30_indoor': number;

  @Column()
  @Field(() => Int)
  '03_30_06_30_indoor': number;

  @Column()
  @Field(() => Int)
  sampling_nights_no_outdoor: number;

  @Column()
  @Field(() => Int)
  '18_30_21_30_outdoor': number;

  @Column()
  @Field(() => Int)
  '21_30_00_30_outdoor': number;

  @Column()
  @Field(() => Int)
  '00_30_03_30_outdoor': number;

  @Column()
  @Field(() => Int)
  '03_30_06_30_outdoor': number;

  @Column()
  @Field(() => Int)
  sampling_nights_no_combined: number;

  @Column()
  @Field(() => Int)
  '18_30_21_30_combined': number;

  @Column()
  @Field(() => Int)
  '21_30_00_30_combined': number;

  @Column()
  @Field(() => Int)
  '00_30_03_30_combined': number;

  @Column()
  @Field(() => Int)
  '03_30_06_30_combined': number;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  notes: string;

  // Associations

  @OneToOne(() => Bionomics, bionomics => bionomics.biting_activity,
  {onDelete: 'CASCADE'} )
  bionomics: Promise<Bionomics>
}
