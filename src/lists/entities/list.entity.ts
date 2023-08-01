import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity("lists")
export class List {
  
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('text')
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.lists, { eager: true })
  @Index('userIdList-index')
  user: User;
}
