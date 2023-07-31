import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column('text')
  name: string;

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  quantityUnits?: string;

  @Field(() => String)
  @Column('text')
  category: string;

  @ManyToOne(() => User, user => user.items, { nullable: false, eager: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;
}
