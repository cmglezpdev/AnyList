import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field(() => String)
  @Column('text')
  name: string;

  @Column('int')
  @Field(() => Float)
  quantity: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string; // g, kg, tsp

  // stores
  // user
}
