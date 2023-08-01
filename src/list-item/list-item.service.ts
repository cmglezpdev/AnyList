import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListItem } from './entities/list-item.entity';
import { User } from '../users/entities/user.entity';
import { CreateListItemInput, UpdateListItemInput } from './dto/input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
  ){}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const listItem = this.listItemsRepository.create({
      ...rest,
      list: { id: listId },
      item: { id: itemId }
    });

    await this.listItemsRepository.save(listItem);
    return this.findOne(listItem.id)
  }

  async findAll(id: string, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search = "" } = searchArgs;
    return this.listItemsRepository.find({
      take: limit,
      skip: offset,
      where: {
        list: { id },
      }
    });
  }

  async countListItemsByList(id: string): Promise<number> {
    return this.listItemsRepository.count({
      where: { list: { id } }
    });
  }


  async findOne(id: string) {
    const listItem = this.listItemsRepository.findOneBy({ id });
    if(!listItem) throw new NotFoundException(`List Item with id ${id} not found`);
    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository.createQueryBuilder()
      .update()
      .set({ ...rest })
      .where('id = :id', { id });

    if(listId) queryBuilder.set({ list: { id: listId } });
    if(itemId) queryBuilder.set({ item: { id: itemId } });
    await queryBuilder.execute();
    return this.findOne(id);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
