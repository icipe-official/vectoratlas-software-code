import { ObjectType, Field } from "@nestjs/graphql";
import { Geometry } from "geojson";
import { GeoJSONPoint } from "../shared/entities/site.entity";

@ObjectType()
export class OccurrenceReturn {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: true })
  species: string;

  @Field(() => GeoJSONPoint, { nullable: false })
  location: Geometry;
}