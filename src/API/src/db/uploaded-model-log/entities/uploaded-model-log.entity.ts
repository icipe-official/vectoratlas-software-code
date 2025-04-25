import { Field, ObjectType } from '@nestjs/graphql';
import { UploadedModelActionTypeEnum } from '../../../../src/commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  Timestamp,
} from 'typeorm';
import { UploadedModel } from '../../uploaded-model/entities/uploaded-model.entity';

@Entity('model_log')
@ObjectType({ description: 'UploadedModel Log' })
export class UploadedModelLog extends BaseEntityExtended {
  /**
   * Type of action that was performed
   */
  @Column({
    nullable: false,
    type: 'text',
    // type: 'enum',
    // enum: UploadedModelActionTypeEnum,
  })
  @Field(() => String, { nullable: true })
  action_type: string;

  /**
   * Date when action occurred
   */
  // @Column({
  //   nullable: false,
  //   type: 'timestamptz',
  // })
  // @Field(() => String, { nullable: true })
  @CreateDateColumn()
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
    nullable: true,
    type: 'text',
  })
  @Field(() => String, { nullable: true })
  action_taker: string;

  /**
   * Uploaded model against which we are keeping a log
   */
  @ManyToOne(() => UploadedModel, (model) => model.id, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  @Field(() => UploadedModel, { nullable: true })
  uploaded_model: UploadedModel;

  @BeforeInsert()
  @BeforeUpdate()
  validateActionType() {
    const vals = [];
    Object.keys(UploadedModelActionTypeEnum).forEach((key) =>
      vals.push(UploadedModelActionTypeEnum[key]),
    );
    if (!vals.includes(this.action_type)) {
      throw 'Invalid value for action type';
    }
  }
}
