import { Field, ObjectType } from '@nestjs/graphql';
import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from '../../../commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('communication_log')
@ObjectType({ description: 'Communication Log' })
export class CommunicationLog extends BaseEntityExtended {
  /**
   * Date of communication
   */
  @CreateDateColumn()
  communication_date?: Date;

  /** Channel of communication */
  @Column({
    nullable: true,
    type: 'enum',
    enum: CommunicationChannelType,
    default: CommunicationChannelType.EMAIL,
  })
  @Field(() => String, { nullable: false })
  channel_type: string;

  /** Recipients of the communication */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  recipients: string;

  /** Type or subject of message being communicated */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  message_type: string;

  /** Message to be communicated */
  @Column({ nullable: false })
  @Field(() => String, { nullable: false })
  message: string;

  /** Sent status of the message */
  @Column({
    nullable: true,
    type: 'enum',
    enum: CommunicationSentStatus,
    default: CommunicationSentStatus.PENDING,
  })
  sent_status: string;

  /** Date the message was sent */
  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  sent_date?: Date;

  /** Response after sending communication */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  sent_response?: string;

  /** Type of entity that triggered this communication */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  reference_entity_type?: string;

  /** Name or Id of the entity that triggered this communication */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  reference_entity_name?: string;

  /** Type of error that occurred during sending of the message */
  // @Column({ nullable: true })
  // @Field(() => String, { nullable: true })
  // error_type: string;

  /** Details of error that occurred during sending of the message */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  error_description?: string;

  /** Arguments or extra data passed during sending of the message */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  arguments?: string;
}