import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ValidRoles } from '../../auth/enums';

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
}
