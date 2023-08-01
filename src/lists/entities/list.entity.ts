import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity("lists")
export class List {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  // Relation, index('user-id-list-index')
  user: User;
}
