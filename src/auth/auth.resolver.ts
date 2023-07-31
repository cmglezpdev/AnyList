import { Mutation, Resolver, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { SignUpInput, SignInInput } from './dto/input';
import { AuthResponse } from './types';

@Resolver()
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

  // @Query(() => , { name: 'revalite' })
  // revalidateToken(): Promise<string> {
  //   // return this.authService.revalidateToken();
  // }
}
