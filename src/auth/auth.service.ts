import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
import { SignInInput, SignUpInput } from './dto/input';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

  constructor(
      private readonly usersService: UsersService,
      private readonly jwtService: JwtService
  ){}

  private getJwtToken(id: string) {
    return this.jwtService.sign({ id });
  }  

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);
    const token = this.getJwtToken(user.id);
    return {user, token};
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;
    const user = await this.usersService.findOneByEmail(email);

    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) throw new BadRequestException('Email / Password do not match');
    const token = this.getJwtToken(user.id);
    return {user, token}; 
  }
}
