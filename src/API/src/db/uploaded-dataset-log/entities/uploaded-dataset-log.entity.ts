import { Field, ObjectType } from '@nestjs/graphql';
import { UploadedDatasetActionType } from '../../../commonTypes';
import { BaseEntityExtended } from '../../../db/base.entity.extended';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('uploaded_dataset_log')
@ObjectType({ description: 'Uploaded Dataset Log' })
export class UploadedDatasetLog extends BaseEntityExtended {
  /**
   * Type of action that was performed
   */
  @Column({
    nullable: false,
    type: 'text',
    // type: 'enum',
    // enum: UploadedDatasetActionType,
  })
  @Field(() => String, { nullable: true })
  action_type: string;

  /**
   * Date when action occurred
   */
  @Column({
    nullable: false,
    type: 'date',
  })
  @Field(() => String, { nullable: true })
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
  @JoinColumn()
  @Field(() => UploadedDataset, { nullable: true })
  uploaded_dataset: UploadedDataset;

  @BeforeInsert()
  @BeforeUpdate()
  validateActionType() {
    const vals = [];
    Object.keys(UploadedDatasetActionType).forEach((key) =>
      vals.push(UploadedDatasetActionType[key]),
    );
    if (!vals.includes(this.action_type)) {
      throw 'Invalid value for action type';
    }
  }
}
