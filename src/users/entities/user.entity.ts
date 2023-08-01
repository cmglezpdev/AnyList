import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, JoinTable } from 'typeorm';

import { ValidRoles } from '../../auth/enums';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;
  
  @Column('text')
  @Field(() => String)
  fullName: string;
  
  @Column('text', { unique: true })
  @Field(() => String)
  email: string;
  
  @Column('text')
  password: string;
  
  @Column({ type: 'text', array: true, default: [ValidRoles.user] })
  @Field(() => [ValidRoles])
  roles: ValidRoles[];
  
  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, user => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
  
  @OneToMany(() => Item, item => item.user, { lazy: true, nullable: true })
  @JoinColumn()
  // @Field(() => [Item], { nullable: true })
  items?: Item[];

  @OneToMany(() => List, list => list.user, { lazy: true, nullable: true })
  @JoinTable()
  lists: List[];
}
