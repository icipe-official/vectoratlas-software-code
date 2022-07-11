import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'geo data'})
@Entity('geo_data')
export class GeoData {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('varchar', { length: 80 })
    strain: string;

    @Field()
    @Column()
    prevalence: number

    @Field()
    @Column()
    longitude: number

    @Field()
    @Column()
    lattitude: number
}