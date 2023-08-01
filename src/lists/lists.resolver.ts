import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';

import { ListsService } from './lists.service';
import { ListItemService } from '../list-item/list-item.service';
import { User } from '../users/entities/user.entity';
import { List } from './entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { CreateListInput, UpdateListInput } from './dto/input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService,
  ) {}

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

  @Mutation(() => List, { name: "removeList" })
  removeList(
    @GetUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: 'items' })
  getListItems(
    @GetUser() user: User,
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() SearchArgs: SearchArgs
  ): Promise<ListItem[]> {
    // TODO: valida que el usuario sea el dueño de la lista
    return this.listItemService.findAll(list.id, paginationArgs, SearchArgs);
  }

  @ResolveField(() => Int, { name: 'totalItems' })
  async countListItemsByList(
    @Parent() list: List
  ): Promise<number> {
    return this.listItemService.countListItemsByList(list.id);
  }
}
