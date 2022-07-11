import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('geo_data')
export class GeoDataEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 80 })
    species: string;

    @Column()
    prevalence: number

    @Column()
    longitude: number

    @Column()
    lattitude: number
}