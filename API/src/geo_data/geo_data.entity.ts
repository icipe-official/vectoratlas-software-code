import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Geometry } from 'geojson';

@Entity('geo_data')
export class GeoDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 80 })
  species: string;

  @Column()
  prevalence: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Geometry;
}
