import { Entity, Column } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';

@Entity('species_information')
@ObjectType({ description: 'Information for a particular species' })
export class SpeciesInformation extends BaseEntity {
  @Column('varchar', { length: 256, nullable: false })
  @Field({ nullable: false })
  name: string;

  @Column('varchar', { length: 1024, nullable: false })
  @Field({ nullable: false })
  shortDescription: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  description: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  speciesImage: string;

  @Column('varchar', { length: 256, nullable: false })
  @Field({ nullable: false })
  distributionMapUrl: string;
}
