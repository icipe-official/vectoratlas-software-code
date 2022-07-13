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

@ObjectType({ description: 'geo data' })
export class GeoData {
  @Field()
  id: string;

  @Field({ nullable: true })
  species?: string;

  @Field(() => Float)
  prevalence: number;

  @Field(() => GeoJSONPoint)
  location?: Geometry;
}
