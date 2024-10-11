import { Field, ObjectType } from '@nestjs/graphql';
import { UploadedDatasetStatus } from '../../../commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import { getCurrentUser, getCurrentUserName } from '../../doi/util';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
} from 'typeorm';

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
    nullable: false,
    type: 'enum',
    enum: UploadedDatasetStatus,
  })
  @Field(() => String, { nullable: false })
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

  /**
   * Who approved VA uploaded dataset. Only applies to VA data
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  va_final_checked_by: string;

  @BeforeInsert()
  setUploaderName() {
    this.uploader_name = getCurrentUserName();
  }

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
