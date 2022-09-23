import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { GraphQLScalarType, Kind } from 'graphql';
import { Geometry } from 'geojson';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

const GeoJSONSitePoint = new GraphQLScalarType({
  name: 'GeoJSONSitePoint',
  description: 'Geometry scalar type',
  parseValue(value) {
    return value;
  },

  serialize(value) {
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return new Object(ast);
    }
    return null;
  },
});

@Entity('site')
@ObjectType({ description: 'site data' })
export class Site extends BaseEntity {
  @Column('varchar', { length: 250, nullable: false })
  @Field({ nullable: false })
  country: string;

  @Column('varchar', { length: 250, nullable: false })
  @Field({ nullable: false })
  name: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  map_site: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  @Field(() => GeoJSONSitePoint, { nullable: false })
  location: Geometry;

  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: true })
  latitude: string;

  @Column('varchar', { length: 50, nullable: false })
  @Field({ nullable: true })
  longitude: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  georef_source: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  site_notes: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  gaul_code: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  admin_level: number;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  georef_notes: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  admin_1: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  admin_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  admin_3: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  admin_2_id: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => GeoJSONSitePoint, { nullable: true })
  location_2: Geometry;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  latitude_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  longitude_2: string;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  latlong_source: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  good_guess: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  bad_guess: boolean;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  rural_urban: string;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_forest: boolean;

  @Column('boolean', { nullable: true })
  @Field({ nullable: true })
  is_rice: boolean;

  @Column('varchar', { length: 50, nullable: true })
  @Field({ nullable: true })
  area_type: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.site)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.site)
  occurrence: Occurrence[];
}
