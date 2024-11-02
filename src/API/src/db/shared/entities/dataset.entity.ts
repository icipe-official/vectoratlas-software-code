import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';
import { UploadedDataset } from '../../uploaded-dataset/entities/uploaded-dataset.entity';
import { DOI } from '../../doi/entities/doi.entity';

@Entity('dataset')
@ObjectType({ description: 'dataset' })
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
