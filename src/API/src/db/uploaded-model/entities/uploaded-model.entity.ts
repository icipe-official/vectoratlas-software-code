import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntityExtended } from '../../base.entity.extended';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne } from 'typeorm';
import { DOI } from '../../doi/entities/doi.entity';
import { UploadedModelLog } from '../../../db/uploaded-model-log/entities/uploaded-model-log.entity';

@Entity('model')
@ObjectType({ description: 'model' })
export class UploadedModel extends BaseEntityExtended {
  /**
   * Title of the model
   */
  @Column({
    nullable: false,
  })
  @Field(() => String, { nullable: false })
  title: string;

  /**
   * Brief description of the model
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  description: string;

  /**
   * Timestamp of the latest upload
   */
  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  @Field(() => Date, { nullable: false })
  last_upload_date: Date;

  /**
   * Name of the file that has been uploaded
   * We will use this name to retrieve the file from disk
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploaded_file_name: string;

  /**
   * Was dataset reupload requested
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true })
  is_reupload_requested: boolean;

  /**
   * Date when dataset reupload was requested
   */
  @Column({
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  reupload_requested_date: Date;

  /**
   * Was dataset reupload requested
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  reupload_request_comment: string;

  /**
   * Was dataset reuploaded
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true })
  is_reuploaded: boolean;

  /**
   * Date when dataset was reuploaded
   */
  @Column({
    nullable: true,
  })
  @Field(() => Date, { nullable: true })
  reupload_date: Date;

  /**
   * Reupload dataset comments
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  reupload_comment: string;

  /**
   * DOI provided at time of upload if it exists
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  provided_doi: string;

  /**
   * Status of the uploaded dataset
   */
  @Column({
    nullable: true,
    // type: 'enum',
    // enum: UploadedDatasetStatus,
  })
  @Field(() => String, { nullable: true })
  status: string;

  /**
   * Timestamp of the latest status change
   */
  @CreateDateColumn({
    nullable: false,
    type: 'timestamptz',
  })
  @Field(() => Date, { nullable: false })
  last_status_update_date: Date;

  /**
   * User id of uploader
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploader: string;

  /**
   * Email address of uploader
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploader_email: string;

  /**
   * Name of uploader
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploader_name?: string;

  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  reviewers: string[];

  /**
   * Who approved the uploaded dataset
   */
  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  approved_by: string[];

  /**
   * Who approved the uploaded dataset
   */
  @Column({
    nullable: true,
    type: 'timestamptz',
  })
  @Field(() => Date, { nullable: true })
  approved_on: Date;

  /**
   * Country where dataset was collected
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  source_country: string;

  /**
   * Region in the country where dataset was collected
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  source_region: string;

  /**
   * Is DOI requested
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true })
  is_doi_requested: boolean;

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
   * Maximum value of the model
   */
  @Column({
    nullable: true,
  })
  @Field(() => Number, { nullable: true })
  maxValue: number;

  // Associations
  @OneToMany(() => UploadedModelLog, (log) => log.uploaded_model, {
    onDelete: 'CASCADE',
  })
  @Field(() => [UploadedModelLog], { nullable: true })
  uploaded_model_log: UploadedModelLog[];

  @OneToOne(() => DOI, (doi) => doi.uploaded_model, {})
  @Field(() => DOI, { nullable: true })
  doi: DOI;
}
