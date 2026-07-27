import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';

@Entity('species_information')
@ObjectType({ description: 'Information for a particular species' })
export class SpeciesInformation extends BaseEntity {
  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  name: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  shortDescription: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  description: string;

  // Original, large JPEG. Only ever needed for downloading —
  // never fetched by the list query.
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  speciesImage: string;

  // Small WebP version, generated automatically whenever a new
  // speciesImage is uploaded. This is what gets displayed everywhere.
  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  previewImage: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  distributionMapUrl: string;

  @Column('text', { array: true, nullable: true, default: () => "'{}'" })
  @Field(() => [String], { nullable: true })
  citations?: string[];

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  link: string;
}
