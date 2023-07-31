import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => User, user => user.items, { nullable: false, eager: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;
}
