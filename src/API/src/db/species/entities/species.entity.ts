import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityExtended } from '../../base.entity.extended';
import { RecordedSpecies } from '../../shared/entities/recorded_species.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('species')
export class Species extends BaseEntityExtended {
  @Field(() => String)
  @PrimaryColumn()
  id: string;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  display_name?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  color?: string;

  /**
   * Alternative spellings / names for the species
   */
  @Field(() => [String])
  @Column('varchar', {
    nullable: false,
    array: true,
    default: [],
  })
  alternative_names: string[];

  @Field(() => [RecordedSpecies], { nullable: true })
  @OneToMany(() => RecordedSpecies, (recordedSpecies) => recordedSpecies.speciesDetails)
  recorded_species: RecordedSpecies[];

  @BeforeInsert()
  generateId() {
    this.id = this.name;
  }
}
