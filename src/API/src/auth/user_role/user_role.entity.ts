import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_role')
@ObjectType({ description: 'user role data' })
export class UserRole {
  @PrimaryColumn({ type: 'varchar' })
  @Field({ nullable: false })
  auth0_id: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_uploader: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_reviewer: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_admin: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_editor: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_reviewer_manager: boolean;
}
