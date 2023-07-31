import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { FindAllArgs } from './dto/args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() findAllArgs: FindAllArgs
  ): Promise<User[]> {
    return this.usersService.findAll(findAllArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }) id: string
  ): Promise<User> {
      throw new Error('findOne Query not implement');
    // return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }) id: string
  ): Promise<User> {
    return this.usersService.block(id);
  }
}
