import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { GetUser } from '../auth/decorators';
import { User } from '../users/entities/user.entity';
import { CreateListInput, UpdateListInput } from './dto/input';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List)
  createList(
    @GetUser() user: User,
    @Args('createListInput') createListInput: CreateListInput
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @GetUser() user: User
  ): Promise<List[]> {
    return this.listsService.findAll(user);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @GetUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ) {
    return this.listsService.findOne(id, user);
  }

  // @Mutation(() => List)
  // updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
  //   return this.listsService.update(updateListInput.id, updateListInput);
  // }

  // @Mutation(() => List)
  // removeList(@Args('id', { type: () => Int }) id: number) {
  //   return this.listsService.remove(id);
  // }
}
