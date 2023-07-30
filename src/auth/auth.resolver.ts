import { Mutation, Resolver, Args } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { SignUpInput } from './dto/input';
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
  
  // @Mutation(() => , { name: 'signIn' })
  // signIn(

  // ): Promise<User> {
  //   // return this.authService.signIn();
  // }

  // @Query(() => , { name: 'revalite' })
  // revalidateToken(): Promise<string> {
  //   // return this.authService.revalidateToken();
  // }
}
