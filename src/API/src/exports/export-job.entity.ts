import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToOne } from 'typeorm';
import { BaseEntityExtended } from '../db/base.entity.extended';
import GraphQLJSON from 'graphql-type-json';
import { DOI } from '../db/doi/entities/doi.entity';
export type ExportJobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

@Entity('exportJob')
@ObjectType()
export class ExportJob extends BaseEntityExtended {
  @Index()
  @Column({ nullable: true, type: 'varchar' })
  @Field(() => String, { nullable: true })
  requestHash?: string;

  @Column({ nullable: true, type: 'jsonb' })
  @Field(() => GraphQLJSON, { nullable: true })
  filtersJson?: Record<string, any>;

  @Column({ default: false })
  @Field(() => Boolean)
  generateDoi: boolean;

  @Column({ nullable: true, type: 'varchar' })
  @Field(() => String, { nullable: true })
  downloaderName?: string;

  @Column({ nullable: true, type: 'varchar' })
  @Field(() => String, { nullable: true })
  downloaderEmail?: string;

  @Index()
  @Column({ type: 'varchar', default: 'queued' })
  @Field(() => String)
  status: ExportJobStatus;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  progress: number;

  @Column({ nullable: true, type: 'varchar' })
  @Field(() => String, { nullable: true })
  fileName?: string;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { nullable: true })
  blobPath?: string;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Column({ nullable: true, type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  startedAt?: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  expiresAt?: Date;

  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  occurrence_ids?: string[];

  @OneToOne(() => DOI, (doi) => doi.export_job, {})
  @Field(() => DOI, { nullable: true })
  doi: DOI;
}
