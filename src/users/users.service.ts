import { Injectable, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignUpInput } from '../auth/dto/input';
import { FindAllArgs } from './dto/args';
import { UpdateUserInput } from './dto/inputs';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService')

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const user = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10)
      });

      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll(findAllArgs: FindAllArgs): Promise<User[]> {
    const { roles } = findAllArgs;
    if(roles.length === 0) return this.usersRepository.find();
    return this.usersRepository.createQueryBuilder()
      .where('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if(!user) throw new BadRequestException(`The user with id ${id} not found`);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if(!user) throw new BadRequestException(`The ${email} not found`);
    return user;
  }

  async block(id: string, adminUser: User): Promise<User> {
    const userToBlock = await this.usersRepository.findOneBy({ id });
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;
    return this.usersRepository.save(userToBlock);
  }

  async update(id: string, updateUserInput: UpdateUserInput, adminUser: User): Promise<User> {
    try {
      const user = await this.usersRepository.preload(updateUserInput);
      if(updateUserInput.password) {
        user.password = bcrypt.hashSync(updateUserInput.password, 10);
      }

      user.lastUpdateBy = adminUser;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
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
