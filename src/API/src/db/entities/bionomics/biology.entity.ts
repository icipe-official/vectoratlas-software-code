import { Entity, Column, OneToMany } from 'typeorm';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { BaseEntity } from '../base.entity';
import { Bionomics } from '../bionomics/bionomics.entity';

@Entity('biology')
@ObjectType({ description: 'bionomics biology data' })
export class Biology extends BaseEntity{
  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  sampling_1: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  sampling_2: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  sampling_3: string;

  @Column('varchar', { length: 50 })
  @Field({ nullable: true })
  sampling_n: string;

  @Column()
  @Field(() => Float, { nullable: true })
  parity_n: number;

  // Associations

  @OneToMany(() => Bionomics, bionomics => bionomics.species)
  bionomics: Promise<Bionomics[]>
}