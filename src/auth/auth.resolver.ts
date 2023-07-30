import { Mutation, Resolver, Query } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import {  } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => , { name: 'signUp' })
  signUp(

  ): Promise<User> {
    // return this.authService.signUp();
  }
  
  @Mutation(() => , { name: 'signIn' })
  signIn(

  ): Promise<User> {
    // return this.authService.signIn();
  }

  @Query(() => , { name: 'revalite' })
  revalidateToken(): Promise<string> {
    // return this.authService.revalidateToken();
  }
}
