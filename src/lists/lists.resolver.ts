import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { GetUser } from '../auth/decorators';
import { User } from '../users/entities/user.entity';
import { CreateListInput, UpdateListInput } from './dto/input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  @Mutation(() => List, { name: "createList" })
  createList(
    @GetUser() user: User,
    @Args('createListInput') createListInput: CreateListInput
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @GetUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(paginationArgs, searchArgs, user);
  }

  @Query(() => List, { name: 'list' })
  findOne(
    @GetUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: "updateList" })
  updateList(
    @GetUser() user: User,
    @Args('updateListInput') updateListInput: UpdateListInput
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(
    @GetUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }
}
