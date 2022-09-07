import { Entity, Column, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Reference } from './reference.entity';

@Entity('citation')
@Unique(['author', 'report_title', 'date_undertaken'])
@ObjectType({ description: 'citation data' })
export class Citation extends BaseEntity {
  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  author: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  report_title: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  date_undertaken: string;

  // Associations

  @ManyToOne(() => Reference, (reference) => reference.citations,
    {onDelete: 'CASCADE', nullable: true })
  reference: Reference;
}
