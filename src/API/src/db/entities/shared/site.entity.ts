import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';
import { GraphQLScalarType, Kind } from 'graphql';
import { Geometry } from 'geojson';

const GeoJSONPoint = new GraphQLScalarType({
  name: 'GeoJSONPoint',
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
export class Site extends BaseEntity{
  @Column('varchar', { length: 250 })
  @Field({ nullable: false })
  country: string;

  @Column('varchar', { length: 250 })
  @Field({ nullable: false })
  name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  map_site: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => GeoJSONPoint, { nullable: false })
  location: Geometry;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  area_type: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  georef_source: string;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  site_notes: string;

  @Column()
  @Field(() => Int, { nullable: true })
  gaul_code: number;

  @Column()
  @Field(() => Int, { nullable: true })
  admin_level: number;

  @Column('varchar', { length: 10485760 })
  @Field({ nullable: true })
  georef_notes: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  admin_1: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  admin_2: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  admin_3: string;

  @Column()
  @Field(() => Int, { nullable: true })
  admin_2_id: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => GeoJSONPoint, { nullable: false })
  location_2: Geometry;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  latlong_source: string;

  @Column('boolean')
  @Field({ nullable: true })
  good_guess: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  bad_guess: boolean;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  rural_urban: string;

  @Column('boolean')
  @Field({ nullable: true })
  is_forest: boolean;

  @Column('boolean')
  @Field({ nullable: true })
  is_rice: boolean;

  // Associations

  @OneToMany(() => Bionomics, bionomics => bionomics.site)
  bionomics: Promise<Bionomics[]>
}