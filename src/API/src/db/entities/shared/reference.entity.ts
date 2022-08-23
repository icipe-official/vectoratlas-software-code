import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';

@Entity('reference')
@ObjectType({ description: 'reference data' })
export class Reference extends BaseEntity{
  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  author: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  article_title: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: true })
  journal_title: string;

  @Column()
  @Field(() => Int, { nullable: true })
  year: number;

  @Column('boolean')
  @Field({ nullable: true })
  published: boolean;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  report_type: string;

  @Column('boolean')
  @Field({ nullable: true })
  v_data: boolean;

  // Associations

  @OneToMany(() => Bionomics, bionomics => bionomics.reference)
  bionomics: Promise<Bionomics[]>
}