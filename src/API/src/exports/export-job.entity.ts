import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
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
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  requestHash?: string;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { nullable: true })
  filtersJson?: string;

  @Column({ default: false })
  @Field(() => Boolean, { nullable: false })
  generateDoi: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  downloaderName?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  downloaderEmail?: string;

  @Column({ default: 'queued' })
  @Field(() => String, { nullable: false })
  status: ExportJobStatus;

  @Column({ default: 0 })
  @Field(() => Int, { nullable: false })
  progress: number;

  @Column({ nullable: true })
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
