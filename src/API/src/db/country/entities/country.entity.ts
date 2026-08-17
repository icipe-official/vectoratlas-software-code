import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityExtended } from '../../base.entity.extended'; //' src/db/base.entity.extended';
import { Site } from '../../shared/entities/site.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('country')
export class Country extends BaseEntityExtended {
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Column({ length: 2, unique: true, nullable: true })
  iso_code_2: string;

  @Column({ length: 3, unique: true, nullable: true })
  iso_code_3: string;

  /**
   * Possible names for the country
   */
  @Field(() => [String])
  @Column('varchar', {
    nullable: false,
    array: true,
    default: [],
  })
  alternative_names: string[];

  @Field(() => [Site], { nullable: true })
  @OneToMany(() => Site, (site) => site.site_country)
  sites: Site[];

  @BeforeInsert()
  generateId() {
    this.id = this.name;
  }
}
