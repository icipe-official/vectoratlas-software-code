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

  
  @Column('bytea', { nullable: true })
  speciesImage: Buffer;

  
  @Column('bytea', { nullable: true })
  previewImage: Buffer;

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