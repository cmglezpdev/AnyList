import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

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

  @OneToMany(() => ListItem, item => item.list)
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
