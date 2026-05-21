import { ObjectType, Field } from '@nestjs/graphql';
import { Geometry } from 'geojson';
import { GeoJSONPoint } from '../shared/entities/site.entity';

@ObjectType()
export class OccurrenceReturn {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: true })
  species: string;

  @Field({ nullable: true })
  binary_presence: string;

  @Field(() => GeoJSONPoint, { nullable: false })
  location: Geometry;

  @Field({ nullable: true })
  country: string; // NEW: For country filter

  @Field( { nullable: true })
  year_start: number; // NEW: For Time Range filter

  @Field(() => Boolean, { nullable: true })
  is_adult: boolean; // NEW: For Adult filter

  @Field(() => Boolean, { nullable: true })
  is_larval: boolean; // NEW: For Larval filter

}
