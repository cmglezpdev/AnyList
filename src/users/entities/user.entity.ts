import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  @Field(() => String)
  password: string;
  
  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String])
  roles: string[];
  
  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;
}
