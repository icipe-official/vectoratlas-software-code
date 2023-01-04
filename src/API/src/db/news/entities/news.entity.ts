import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';

@Entity('news')
@ObjectType({ description: 'News stories for Vector Atlas' })
export class News extends BaseEntity {
  @Column('varchar', { length: 256, nullable: false })
  @Field({ nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  summary: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  article: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  image: string;

  @Column('timestamptz', { nullable: false })
  @Field({ nullable: false })
  lastUpdated: Date;
}
