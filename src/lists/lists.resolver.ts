import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

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
  ) {
    return this.listsService.create(createListInput, user);
  }

  // @Query(() => [List], { name: 'lists' })
  // findAll() {
  //   return this.listsService.findAll();
  // }

  // @Query(() => List, { name: 'list' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.listsService.findOne(id);
  // }

  // @Mutation(() => List)
  // updateList(@Args('updateListInput') updateListInput: UpdateListInput) {
  //   return this.listsService.update(updateListInput.id, updateListInput);
  // }

  // @Mutation(() => List)
  // removeList(@Args('id', { type: () => Int }) id: number) {
  //   return this.listsService.remove(id);
  // }
}
