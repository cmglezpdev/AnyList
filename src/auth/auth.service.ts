import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SignUpInput } from './dto/input';
import { AuthResponse } from './types';
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
}
