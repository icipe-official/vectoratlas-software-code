import { Field, Int, ObjectType } from '@nestjs/graphql';
import { randomInt, randomUUID } from 'crypto';
import { AuthUser } from 'src/auth/user.decorator';
import { ApprovalStatus } from '../../../commonTypes';
import { BaseEntityExtended } from '../../../db/base.entity.extended';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity'; // ' src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { Column, Entity, OneToOne } from 'typeorm';

export interface DOIMetadata {
  filters: object;
  fields: string[];
}

@Entity('doi')
@ObjectType({ description: 'doi' })
export class DOI extends BaseEntityExtended {
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  creator_name: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  creator_email: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  description: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  title: string;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  publication_year: number;

  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  source_type: string;

  @Column({ nullable: false, type: 'json' })
  @Field(() => JSON, { nullable: false })
  meta_data: DOIMetadata;

  @Column({ nullable: true })
  // @Field(() => Int, { nullable: true })
  resolving_url: string;

  @Column({ type: 'json', nullable: true })
  // @Field(() => Int, { nullable: true })
  doi_response: string;

  @Column({ nullable: true })
  // @Field(() => Int, { nullable: true })
  resolver_id: string;

  @Column({ nullable: true })
  doi_id: string;

  @Column({ nullable: true })
  //@Field(() => Int, { nullable: true })
  is_draft: boolean;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: string;

  @Column({ nullable: true, type: 'timestamptz' })
  status_updated_on: Date;

  @Column({ nullable: true })
  status_updated_by: string;

  /**
   * Uploaded dataset against which we are keeping a log
   */
  @OneToOne(() => UploadedDataset, (dataset) => dataset.id, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  dataset: UploadedDataset;
}
