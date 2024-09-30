import { Field, ObjectType } from '@nestjs/graphql';
import { UploadedDatasetStatus } from '../../../commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import { getCurrentUser, getCurrentUserName } from '../../doi/util';
import { BeforeInsert, Column, CreateDateColumn, Entity } from 'typeorm';

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
  uploaded_file_name: string;

  /**
   * Name of the file that has been converted into VA template
   * We will use this name to retrieve the file from disk
   */
  @Column({
    nullable: true,
  })
  converted_file_name: string;

  /**
   * DOI provided at time of upload if it exists
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: false })
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
  last_status_update_date: Date;

  /**
   * Email address of uploader
   */
  @Column({
    nullable: true,
  })
  uploader_email: string;

  /**
   * Name of uploader
   */
  @Column({
    nullable: true,
  })
  uploader_name?: string;

  /**
   * Assigned reviewers who will review the dataset
   */
  @Column({
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  assigned_reviewers: string;

  @BeforeInsert()
  setUploaderName() {
    this.uploader_name = getCurrentUserName();
  }
}
