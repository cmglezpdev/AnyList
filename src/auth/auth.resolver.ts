import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { SignUpInput, SignInInput } from './dto/input';
import { GetUser } from './decorators';
import { JwtAuthGuard } from './guards';
import { AuthResponse } from './types';
import { ValidRoles } from './enums';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation(() => AuthResponse, { name: 'signUp' })
  signUp(
    @Args('signUpInput') signUpInput: SignUpInput
  ): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }
  
  @Mutation(() => AuthResponse, { name: 'signIn' })
  signIn(
    @Args('signInInput') signInInput: SignInInput
  ): Promise<AuthResponse> {
    return this.authService.signIn(signInInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @GetUser([ValidRoles.admin]) user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
