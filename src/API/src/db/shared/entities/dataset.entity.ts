import { Entity, Column, OneToMany, Unique, Timestamp } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

@Entity('dataset')
@ObjectType({ description: 'dataset' })
export class Dataset extends BaseEntity {

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  status: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  lastUpdatedBy: string;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  lastUpdatedTime: Date;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  lastReviewedBy: string;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  lastReviewedTime: Date;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.reference)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.reference)
  occurrence: Occurrence[];
}
