import { Field, ObjectType } from '@nestjs/graphql';
import {
  CommunicationChannelType,
  CommunicationSentStatus,
} from '../../../commonTypes';
import { BaseEntityExtended } from '../../base.entity.extended';
import { BeforeInsert, Column, CreateDateColumn, Entity } from 'typeorm';
import { v4 as uuidv4} from 'uuid';

@Entity('communication_log')
@ObjectType({ description: 'Communication Log' })
export class CommunicationLog extends BaseEntityExtended {
  /**
   * Date of communication
   */
  @CreateDateColumn()
  @Field(() => Date, { nullable: false })
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
  @Column('varchar', {
    nullable: false,
    array: true,
    default: [],
  })
  @Field(() => [String], { nullable: false })
  recipients: string[];

  /** Subject of message being communicated */
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  subject: string;

  /** Type of message being communicated */
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
  @Field(() => String, { nullable: true })
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

  @BeforeInsert()
  setId(){
    this.id = uuidv4();
  }
}
