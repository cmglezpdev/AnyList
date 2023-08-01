import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';

import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateListItemInput, UpdateListItemInput } from './dto/input';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem, { name: 'createListItem' })
  createListItem(
    @GetUser() user: User,
    @Args('createListItemInput') createListItemInput: CreateListItemInput
  ): Promise<ListItem> {
    // TODO: verfy if the list pretenece al usuario
    return this.listItemService.create(createListItemInput);
  }

  @Query(() => ListItem, { name: 'listItem' })
  findOne(
    @GetUser() user: User,
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string
  ): Promise<ListItem> {
    // TODO: verfy if the list pretenece al usuario
    return this.listItemService.findOne(id);
  }
  
  @Mutation(() => ListItem, { name: 'updateListItem' })
  updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput
  ): Promise<ListItem> {
      // TODO: verfy if the list pretenece al usuario
      return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
