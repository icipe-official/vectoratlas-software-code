import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';
import { Citation } from '../../shared/entities/citation.entity';

@Entity('reference')
@Unique(['author', 'article_title', 'journal_title', 'year', 'citations'])
@ObjectType({ description: 'reference data' })
export class Reference extends BaseEntity {
  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  author: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  article_title: string;

  @Column('varchar', { length: 250, nullable: true })
  @Field({ nullable: true })
  journal_title: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  year: number;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  published: boolean;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  report_type: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  v_data: boolean;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.reference)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.reference)
  occurrence: Occurrence[];

  @OneToMany(() => Citation, (citation) => citation.reference)
  citations: Citation[];
}
