import { Field } from '@nestjs/graphql';
import { UploadedDatasetActionType } from '../../../commonTypes';
import { BaseEntityExtended } from '../../../db/base.entity.extended';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity';
import { Column, ManyToOne } from 'typeorm';

export class UploadedDatasetLog extends BaseEntityExtended {
  /**
   * Type of action that was performed
   */
  @Column({
    nullable: false,
    type: 'enum',
    enum: UploadedDatasetActionType,
  })
  @Field(() => String, { nullable: false })
  action_type: string;

  /**
   * Date when action occurred
   */
  @Column({
    nullable: false,
    type: 'date',
  })
  @Field(() => Date, { nullable: false })
  action_date: Date;

  /**
   * Description of the action that occurred
   */
  @Column({
    nullable: false,
    type: 'text',
  })
  @Field(() => String, { nullable: true })
  action_details: string;

  /**
   * Id of the action taker
   */
  @Column({
    nullable: false,
    type: 'text',
  })
  @Field(() => String, { nullable: true })
  action_taker: string;

  /**
   * Uploaded dataset against which we are keeping a log
   */
  @ManyToOne(() => UploadedDataset, (dataset) => dataset.id, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  dataset: UploadedDataset;
}
