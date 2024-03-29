import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('reference')
@Unique(['citation', 'year'])
@ObjectType({ description: 'reference data' })
export class Reference extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  author: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  article_title: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  journal_title: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: true })
  citation: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year: number;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  published: boolean;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  report_type: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  v_data: boolean;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  num_id: number;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.reference)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.reference)
  occurrence: Occurrence[];
}
