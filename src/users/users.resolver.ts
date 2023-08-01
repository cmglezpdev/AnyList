import { UseGuards, ParseUUIDPipe, Search } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindAllArgs } from './dto/args';
import { UpdateUserInput } from './dto/inputs';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/enums';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() findAllArgs: FindAllArgs,
    @GetUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User[]> {
    return this.usersService.findAll(findAllArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetUser([ValidRoles.admin, ValidRoles.superUser]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetUser([ValidRoles.admin]) adminUser: User
  ): Promise<User> {
    return this.usersService.block(id, adminUser);
  }

  @Mutation(() => User, {name: 'updateUser'})
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @GetUser([ValidRoles.admin]) adminUser: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, adminUser);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  itemCount(
    @Parent() user: User,
    @GetUser([ValidRoles.admin]) adminUser: User
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  getItemsOfUser(
    @GetUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs)
  }
}
