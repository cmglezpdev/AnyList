import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateListInput, UpdateListInput } from './dto/input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';
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

  async findAll(paginationArgs: PaginationArgs, searchArgs: SearchArgs, user: User): Promise<List[]> {
      const { limit, offset } = paginationArgs;
      const { search = "" } = searchArgs;

      return this.listsRepository.find({
        take: limit,
        skip: offset,
        where: {
          name: ILike(`%${search}%`),
          user: { id: user.id }
        }
      });
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listsRepository.findOne({ 
      where: { id, user: { id: user.id } }
     });
  
     if(!list) throw new NotFoundException(`The list ${id} not found`);
     return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    return this.listsRepository.save({ ...list,...updateListInput });
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listsRepository.remove(list);
    return {...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listsRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    })
  }
}
