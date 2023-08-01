import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class List {

  id: string;

  name: string;

  // Relation, index('user-id-list-index')
  user: User;
}
