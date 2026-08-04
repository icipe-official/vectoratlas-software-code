import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { News } from './news.entity';

@Entity('news_translation')
@ObjectType({ description: 'Translated content for a News item' })
export class NewsTranslation {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: false })
  id: number;

  @Column('varchar', { name: 'news_id', length: 256, nullable: false })
  @Field({ nullable: false })
  newsId: string;

  @Column('varchar', { length: 5, nullable: false })
  @Field({ nullable: false })
  locale: string;

  @Column('varchar', { length: 500, nullable: true })
  @Field({ nullable: true })
  title: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  summary: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  article: string;

  @CreateDateColumn({ name: 'created_at' })
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => News, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news: News;
}
