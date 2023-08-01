import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListInput, UpdateListInput } from './dto/input';
import { User } from '../users/entities/user.entity';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ){}
  
  async create(createListInput: CreateListInput, user: User): Promise<List> {
      const list = this.listsRepository.create({...createListInput, user });
      return this.listsRepository.save(list);
  }

  async findAll(user: User): Promise<List[]> {
      const lists = this.listsRepository.findBy({
        user: { id: user.id }
      });
      return lists;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} list`;
  // }

  // update(id: number, updateListInput: UpdateListInput) {
  //   return `This action updates a #${id} list`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} list`;
  // }
}
