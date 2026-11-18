import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityExtended } from '../../base.entity.extended';
import { Dataset } from '../../shared/entities/dataset.entity';

@ObjectType()
@Entity('organization')
export class Organization extends BaseEntityExtended {
  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  logo?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  acknowledgement?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  terms_and_conditions?: string;

  @OneToMany(() => Dataset, (dataset) => dataset.organization)
  datasets?: Dataset[];
}
