import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntityExtended } from '../../base.entity.extended'; // Double-check this path matches your folder structure
import { Column, Entity } from 'typeorm';

@Entity('email_registry')
@ObjectType({ description: 'Email Registry and Notification Preferences' })
export class EmailRegistry extends BaseEntityExtended {
  /**
   * Unique email address for the user profile
   */
  @Column({ unique: true, nullable: false })
  @Field(() => String, { nullable: false })
  email: string;

  /** Verification code for email validation */
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  verification_code?: string;

  /** Expiration timestamp for the verification code */
  @Column({ type: 'timestamptz', nullable: true })
  @Field(() => Date, { nullable: true })
  code_expires_at?: Date;

  /** Opt-in status for general news notifications */
  @Column({ default: false, nullable: false })
  @Field(() => Boolean, { nullable: false })
  is_news_notification_enabled: boolean;

  /** Timestamp when news preferences were last updated */
  @Column({ type: 'timestamptz', nullable: true })
  @Field(() => Date, { nullable: true })
  news_last_modified_at?: Date;

  /** Opt-in status for new dataset alerts */
  @Column({ default: false, nullable: false })
  @Field(() => Boolean, { nullable: false })
  is_new_dataset_notification_enabled: boolean;

  /** Timestamp when dataset preferences were last updated */
  @Column({ type: 'timestamptz', nullable: true })
  @Field(() => Date, { nullable: true })
  new_dataset_last_modified_at?: Date;
}


// import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from 'typeorm';

// @Entity('email_registry')

// export class EmailRegistry {
//     @PrimaryColumn()
//     email: string;

//     @Column({type: 'text'})
//     verification_code: string;

//     @Column()
//     code_expires_at: Date;

//     @Column()
//     is_news_notification_enabled: boolean;

//     @Column()
//     news_last_modified_at: Date;

//     @Column()
//     is_new_dataset_notification_enabled: boolean;

//     @Column()
//     new_dataset_last_modified_at: Date;
// }