import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { SignUpInput } from '../auth/dto/input';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async create(signUpInput: SignUpInput) {
    try {
      const user = this.usersRepository.create( signUpInput );
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    throw new Error(`findAll not implemented`)
  }

  findOne(id: string): Promise<User> {
    throw new Error(`findOne not implemented`)
  }

  block(id: string): Promise<User> {
    throw new Error(`block not implemented`)
  }

  private handleDBErrors(error: any): never {
    switch(error.code) {
      case '23505':
        throw new BadRequestException(error.detail.replace('Key', ''));
        default:
          this.logger.error(error)
          throw new InternalServerErrorException('Please check server logs');
  }
}
}
