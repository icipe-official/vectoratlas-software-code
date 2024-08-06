import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from '../../base.entity';
import { Bionomics } from '../../bionomics/entities/bionomics.entity';
import { GraphQLScalarType, Kind } from 'graphql';
import { Geometry } from 'geojson';
import { Occurrence } from '../../occurrence/entities/occurrence.entity';

export const GeoJSONPoint = new GraphQLScalarType({
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
export class Site extends BaseEntity {
  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  country: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: false })
  site: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  @Field(() => GeoJSONPoint, { nullable: false })
  location: Geometry;

  @Column('varchar', { nullable: false })
  @Field({ nullable: true })
  latitude: string;

  @Column('varchar', { nullable: false })
  @Field({ nullable: true })
  longitude: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => GeoJSONPoint, { nullable: true })
  location_2: Geometry;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_3: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_4: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_4: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_5: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_5: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_6: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_6: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_7: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_7: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  latitude_8: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  longitude_8: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  confidence_in_georef: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  area_type: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  georef_source: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  admin_level_1: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  admin_level_2: string;

  @Column('varchar', { nullable: true })
  @Field({ nullable: true })
  site_notes: string;

  // Associations

  @OneToMany(() => Bionomics, (bionomics) => bionomics.site)
  bionomics: Bionomics[];

  @OneToMany(() => Occurrence, (occurrence) => occurrence.reference)
  occurrence: Occurrence[];
}
