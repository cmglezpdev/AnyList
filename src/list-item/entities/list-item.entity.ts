import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity("listItems")
@ObjectType()
export class ListItem {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('numeric')
  @Field(() => Int)
  quantity: number;

  @Column('boolean', { default: false })
  @Field(() => Boolean)
  completed: boolean;

  @ManyToOne(() => List, list => list.listItem, { lazy: true })
  list: List;

  @ManyToOne(() => Item, item => item.listItem, { lazy: true })
  @Field(() => Item)
  item: Item;
}
