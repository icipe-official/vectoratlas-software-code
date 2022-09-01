import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Geometry } from 'geojson';
import { GraphQLScalarType, Kind } from 'graphql';

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

@Entity('geo_data')
@ObjectType({ description: 'geo data' })
export class GeoData {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column('varchar', { length: 80 })
  @Field({ nullable: true })
  species: string;

  @Column()
  @Field(() => Float)
  prevalence: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Field(() => GeoJSONPoint)
  location: Geometry;
}
