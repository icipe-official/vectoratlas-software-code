import { Field, ObjectType } from '@nestjs/graphql';
import { ApprovalStatus, DOISourceType } from '../../../commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import { DOIMetadata } from '../../../db/doi/entities/doi.entity';
import { Dataset } from '../../shared/entities/dataset.entity';
import { Column, Entity, OneToOne } from 'typeorm';

/**
 * Model to store sources of DOI. A source may either be a Downloaded dataset or an uploaded dataset
 */
@Entity('doi_source')
@ObjectType({ description: 'DOI Source' })
export class DoiSource extends BaseEntityExtended {
  /**
   * Where did the DOI originate from. Possible values are Download and Upload
   */
  @Column({
    nullable: false,
    type: 'enum',
    enum: DOISourceType,
  })
  @Field(() => String, { nullable: false })
  source_type: string;

  /**metadata of dataset that was downloaded for which we intend to mint a DOI */
  @Column({ nullable: false, type: 'json' })
  @Field(() => JSON, { nullable: false })
  download_meta_data: DOIMetadata;

  /** Approval status of the DOI request */
  @Column({
    nullable: true,
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: string;

  /** Title of the DOI source. This will be used at the point of generation of actual DOI */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  title: string;

  /** Name of the author/originator/requester */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  author_name: string;

  /** Email of the author/originator/requester. This is mandatory as we will 
   * use this email to communicate with the author as the DOI is going through the approval process
   */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  author_email: string;

  // /** Uploaded Dataset foreign key. Applicable where source_type is Upload */
  // @OneToOne(() => UploadedDataset, (dataset) => dataset.id, {
  //   eager: true,
  //   cascade: true,
  //   nullable: true,
  // })
  // uploaded_dataset: string;

  /** Approved Dataset foreign key. Applicable where source_type is Upload */
  @OneToOne(() => Dataset, (dataset) => dataset.id, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  approved_dataset: Dataset;
}
