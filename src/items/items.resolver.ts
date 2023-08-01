import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UpdateItemInput, CreateItemInput } from './dto/input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: "createItem" })
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput, 
    @GetUser() user: User
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @GetUser() user: User
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => Item, { name: 'item' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetUser() user: User
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @GetUser() user: User
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }) id: string,
    @GetUser() user: User
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
