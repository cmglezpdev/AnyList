import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateItemInput, CreateItemInput } from './dto/input';
import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ){}
  
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemRepository.create({...createItemInput, user });
    return await this.itemRepository.save(item);
  }

  async findAll(user: User): Promise<Item[]> {
      return this.itemRepository.find({ 
        where:{ 
          user: { 
            id: user.id 
          } 
        } 
      });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
        id, user: {
          id: user.id
        }
      });

    if(!item) throw new NotFoundException(`Item with id ${item} not found`);
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User):Promise<Item> {
    const item = await this.findOne(id, user);
    if(!item) throw new NotFoundException(`Item with id ${item} not found`);
    const itemModifed = this.itemRepository.create({
      ...item,
      ...updateItemInput
    });
    return this.itemRepository.save(itemModifed); 
  }

  async remove(id: string, user: User): Promise<Item> {
    // TODO: Soft delete, intergridad referencial
    const item = await this.findOne(id, user);
    await this.itemRepository.remove(item);
    return {...item, id};
  }
}
