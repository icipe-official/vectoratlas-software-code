import { Field, Int, ObjectType } from '@nestjs/graphql';
import { randomInt, randomUUID } from 'crypto';
import { AuthUser } from 'src/auth/user.decorator';
import { ApprovalStatus } from '../../../../src/commonTypes';
import { BaseEntityExtended } from '../../../db/base.entity.extended';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity'; // 'src/db/uploaded-dataset/entities/uploaded-dataset.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UploadedModel } from '../../../../src/db/uploaded-model/entities/uploaded-model.entity';
import { ExportJob } from '../../../exports/export-job.entity';

export interface DOIMetadata {
  filters: object;
  fields: string[];
}

@Entity('doi')
@ObjectType({ description: 'doi' })
export class DOI extends BaseEntityExtended {
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  creator: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  creator_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
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
  //@Field(() => JSON, { nullable: false })
  meta_data: DOIMetadata;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  resolving_url: string;

  @Column({ type: 'json', nullable: true })
  // @Field(() => Int, { nullable: true })
  doi_response: string;

  @Column({ nullable: true })
  // @Field(() => Int, { nullable: true })
  resolver_id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  doi_id: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  is_draft: boolean;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  @Field(() => String, { nullable: true })
  approval_status: string;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  status_updated_on: Date;

  @Column({ nullable: true })
  status_updated_by: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  comments: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  uploadedDatasetId: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  doi_link: string;

  /**
   * Affiliated institution
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true, defaultValue: '' })
  affiliated_institution: string;

  /**
   * Authors
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true, defaultValue: '' })
  author: string;

  /**
   * Uploaded dataset against which we are generating a DOI. Only set when the source_type is Upload
   */
  @OneToOne(() => UploadedDataset, (dataset) => dataset.doi, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'uploadedDatasetId' })
  @Field(() => UploadedDataset, { nullable: true })
  uploaded_dataset: UploadedDataset;

  /**
   * Uploaded model against which we are generating a DOI.
   */
  @OneToOne(() => UploadedModel, (model) => model.doi, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'uploaded_model' })
  @Field(() => UploadedModel, { nullable: true })
  uploaded_model: UploadedModel;

  /**
   * Export Job against which we are generating a DOI. Only set when the source_type is Upload
   */
  @OneToOne(() => ExportJob, (dataset) => dataset.doi, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'export_job' })
  @Field(() => ExportJob, { nullable: true })
  export_job: ExportJob;
}
