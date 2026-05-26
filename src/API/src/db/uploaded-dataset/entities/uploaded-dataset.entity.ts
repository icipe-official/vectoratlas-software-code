import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntityExtended } from '../../base.entity.extended';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UploadedDatasetLog } from '../../uploaded-dataset-log/entities/uploaded-dataset-log.entity';
import { DOI } from '../../doi/entities/doi.entity';

@Entity('uploaded_dataset')
@ObjectType({ description: 'uploaded dataset' })
export class UploadedDataset extends BaseEntityExtended {
  /**
   * Title of the dataset
   */
  @Column({
    nullable: false,
  })
  @Field(() => String, { nullable: false })
  title: string;

  /**
   * Brief description of the dataset
   */
  @Column({
    nullable: false,
  })
  @Field(() => String, { nullable: false })
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
   * Name of the file that has been converted into VA template
   * We will use this name to retrieve the file from disk
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  converted_file_name: string;

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

  /**
   * Reviewers who will conduct primary review of the dataset
   */
  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  primary_reviewers: string[];

  /**
   * Reviewers who will conduct tertiary review of the dataset
   */
  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  tertiary_reviewers: string[];

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
    nullable: false,
  })
  @Field(() => String, { nullable: false })
  source_country: string;

  /**
   * Region in the country where dataset was collected
   */
  @Column({
    nullable: false,
  })
  @Field(() => String, { nullable: false })
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
   * Is Vector atlas data
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true })
  is_va_data: boolean;

  /**
   * Who abstracted VA uploaded dataset. Only applies to VA data
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  va_data_abstracted_by: string;

  /**
   * Who checked VA uploaded dataset. Only applies to VA data
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  va_data_checked_by: string;

  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  va_final_check_by: string;

  /**
   * Who approved VA uploaded dataset. Only applies to VA data
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  va_final_checked_by: string;

  // /**
  //  * Name of the file that has been re-uploaded
  //  * We will use this name to retrieve the file from disk
  //  */
  // @Column({
  //   nullable: true,
  // })
  // @Field(() => String, { nullable: true })
  // reuploaded_file_name: string;

  /**
   * Name of the file that has been uploaded by primary reviewer
   * We will use this name to retrieve the file from disk
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploaded_file_name_primary_reviewed: string;

  /**
   * Name of the file that has been uploaded by tertiary reviewer
   * We will use this name to retrieve the file from disk
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  uploaded_file_name_tertiary_reviewed: string;

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

  // /**
  //  * DOI associated with this dataset
  //  */
  // @OneToOne(() => DOI, (doi) => doi.id, {
  //   eager: true,
  //   nullable: true,
  //   cascade: true,
  // })
  // doi: DOI;

  /**
   * Dataset type
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true, defaultValue: '' })
  dataset_type: string;

  /**
   * Is Validated
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_validated: boolean;

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
   * Is Validated
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_tertiary_review_reassigned: boolean;

  /**
   * Is the full dataset being validated
   */
  @Column({
    nullable: true,
  })
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  is_full_dataset_validation: boolean;

  /**
   * Total data rows
   */
  @Column({
    nullable: true,
    default: 0,
  })
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  total_rows: number;

  /**
   * Which rows were validated
   */
  @Column('int', {
    nullable: true,
    default: 0,
  })
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  validation_start_row: number;

  /**
   * Which rows were validated
   */
  @Column('int', {
    nullable: true,
    default: 0,
  })
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  validation_end_row: number;

  /**
   * Which are the invalid rows
   */
  @Column('int', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [Number], { nullable: true })
  invalid_rows: number[];

  /**
   * Validation errors
   */
  @Column('int', {
    nullable: true,
    array: true,
    default: [],
  })
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  validation_errors: string;

  /**
   * Ingestion Status
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  ingestion_status: string;

  /**
   * Authors
   */
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true, defaultValue: '' })
  ingestion_errors: string;

  /** Number of rows ingested */
  @Column('int', {
    nullable: true,
    default: 0,
  })
  @Field(() => Number, { nullable: true })
  total_ingested_rows: number;

  /** Number of rows ingested */
  @Column('float', {
    nullable: true,
    default: 0,
  })
  @Field(() => Number, { nullable: true })
  ingestion_progress: number;

  /**
   * Reviewers who will conduct tertiary review after reassignment of the dataset
   */
  @Column('varchar', {
    nullable: true,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: true })
  reassigned_tertiary_reviewers: string[];

  // Associations
  @OneToMany(() => UploadedDatasetLog, (log) => log.uploaded_dataset, {
    onDelete: 'CASCADE',
  })
  @Field(() => [UploadedDatasetLog], { nullable: true })
  uploaded_dataset_log: UploadedDatasetLog[];

  @OneToOne(() => DOI, (doi) => doi.uploaded_dataset, {})
  @Field(() => DOI, { nullable: true })
  doi: DOI;

  @BeforeInsert()
  @BeforeUpdate()
  validateVAData() {
    if (this.is_va_data) {
      if (!this.va_data_abstracted_by) {
        throw 'You must specify who abstracted Vector Atlas data';
      }
      if (!this.va_data_checked_by) {
        throw 'You must specify who checked Vector Atlas data';
      }
      if (!this.va_final_checked_by) {
        throw 'You must specify who performed final check on Vector Atlas data';
      }
    }
  }
}
