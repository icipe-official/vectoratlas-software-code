import { BaseEntityExtended } from '../../base.entity.extended'; //' src/db/base.entity.extended';
import { Site } from '../../shared/entities/site.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('country')
export class Country extends BaseEntityExtended {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ length: 2, unique: true, nullable: true })
  iso_code_2: string;

  @Column({ length: 3, unique: true, nullable: true })
  iso_code_3: string;

  /**
   * Possible names for the country
   */
  @Column('varchar', {
    nullable: false,
    array: true,
    default: [],
  })
  alternative_names: string[];

  @OneToMany(() => Site, (site) => site.site_country)
  sites: Site[];

  @BeforeInsert()
  generateId() {
    this.id = this.name;
  }
}
