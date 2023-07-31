import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types';
import { SignInInput, SignUpInput } from './dto/input';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepostory: Repository<User>,
        private readonly usersService: UsersService,
    ){}

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpInput);
    const token = "sgdgdfgfddfdgdd.hfg.sd.gdfhgsdgdfggdfhg-fgd/sdgdf";
    
    // TODO: create JWT
    return {user, token};
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { email, password } = signInInput;
    const user = await this.usersService.findOneByEmail(email);

    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) throw new BadRequestException('Email / Password do not match');
    
    // TODO: create JWT
    const token = "sgfsdgdgdfhfg.g.dfh.df.hs.g.dfghdfhdf";
    return {user, token}; 
  }
}
