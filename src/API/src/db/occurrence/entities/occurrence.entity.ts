import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Reference } from '../../shared/entities/reference.entity';
import { Sample } from './sample.entity';
import { Site } from '../../shared/entities/site.entity';
import { RecordedSpecies } from '../../shared/entities/recorded_species.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Dataset } from '../../shared/entities/dataset.entity';

@Entity('occurrence')
@ObjectType({ description: 'occurrence data' })
export class Occurrence extends BaseEntity {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_start: number;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  timestamp_start: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  month_end: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year_end: number;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  timestamp_end: Date;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  dec_id: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  dec_check: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  map_check: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  vector_notes: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  download_count: number;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  ir_data: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  binary_presence: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  abundance_data: string;

  // Associations

  @ManyToOne(() => Reference, (reference) => reference.occurrence, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  reference: Reference;

  @ManyToOne(() => Site, (site) => site.occurrence, {
    eager: true,
    cascade: true,
    nullable: false,
  })
  site: Site;

  @OneToOne(
    () => RecordedSpecies,
    (recordedSpecies) => recordedSpecies.occurrence,
    {
      eager: true,
      cascade: true,
      nullable: false,
    },
  )
  @JoinColumn()
  recordedSpecies: RecordedSpecies;

  @OneToOne(() => Sample, (sample) => sample.occurrence, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  sample?: Sample | null;

  @ManyToOne(() => Bionomics, (bionomics) => bionomics.occurrence, {
    eager: false,
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  @Field(() => Bionomics, { nullable: true })
  bionomics?: Bionomics | null;

  @ManyToOne(() => Dataset, (dataset) => dataset.occurrence, {
    eager: true,
    cascade: ['insert', 'update'],
    nullable: false,
  })
  dataset: Dataset;
}
