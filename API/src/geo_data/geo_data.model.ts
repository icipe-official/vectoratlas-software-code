import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType({ description: 'geo data'})
export class GeoData {
    @Field()
    id: string;

    @Field({ nullable: true })
    species?: string;

    @Field(type => Float)
    prevalence: number

    @Field(type => Float)
    longitude: number

    @Field(type => Float)
    lattitude: number
}