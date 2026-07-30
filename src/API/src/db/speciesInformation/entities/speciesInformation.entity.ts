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

  // Original, full-size JPEG, stored directly as raw bytes in Postgres.
  // No @Field here — exposed to GraphQL as a base64 string via a
  // @ResolveField in speciesInformation.resolver.ts, since GraphQL has
  // no native binary type. Only ever needed for downloading —
  // still never fetched by the list query (see allSpeciesInformation's
  // select list in the service, unchanged).
  @Column('bytea', { nullable: true })
  speciesImage: Buffer;

  // Small WebP version, generated automatically whenever a new
  // speciesImage is uploaded. This is what gets displayed everywhere.
  // Same base64-via-resolver treatment as speciesImage above.
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