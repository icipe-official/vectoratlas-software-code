import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'; 
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity';
import { DOI } from '../../doi/entities/doi.entity';

@Entity('dataset')
@ObjectType({ description: 'Dataset metadata and associations' })
export class Dataset extends BaseEntity {
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  status: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  doi: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  UpdatedBy: string;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field(() => Date, { nullable: true })
  UpdatedAt: Date;

  @Column('varchar', { nullable: true, array: true, default: [] })
  @Field(() => [String], { nullable: true })
  ReviewedBy: string[];

  @Column({ nullable: true, type: 'timestamptz', array: true, default: [] })
  @Field(() => [Date], { nullable: true })
  ReviewedAt: Date[];

  @Column('varchar', { nullable: true, array: true, default: [] })
  @Field(() => [String], { nullable: true })
  ApprovedBy: string[];

  @Column({ nullable: true, type: 'timestamptz', array: true, default: [] })
  @Field(() => [Date], { nullable: true })
  ApprovedAt: Date[];

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  dataType: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  dataSource: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  title: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  location: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  region: string;

  @Column('varchar', { nullable: false, default: '' })
  @Field()
  fileName: string;

  @Column('int', { nullable: false, default: 0 })
  @Field()
  fileSize: number;

  @Column('varchar', { nullable: false, default: '' })
  @Field()
  fileType: string;

  // Associations
  @OneToMany(() => Bionomics, (bionomics) => bionomics.dataset)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.dataset)
  occurrence: Occurrence[];

  /**
   * DOI that is linked to this dataset
   */
  @OneToOne(() => DOI, (dataset) => dataset.id, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  // @Field(() => DOI, { nullable: true })
  doi_ref: DOI;

  /**
   * Uploaded dataset that generated this dataset
   */
  @OneToOne(() => UploadedDataset, (dataset) => dataset.id, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  // @Field(() => UploadedDataset, { nullable: true })
  uploaded_dataset: UploadedDataset;
}
