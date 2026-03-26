import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntityExtended } from '../db/base.entity.extended';

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
  @Field(() => String, { nullable: true })
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
}
