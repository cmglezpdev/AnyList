import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { List } from '../lists/entities/list.entity';
import { ListItem } from '../list-item/entities/list-item.entity';

import { SEED_USERS, SEED_ITEMS, SEED_LIST } from './data/seed-data'; 

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listsService: ListsService,
        private readonly listItemsService: ListItemService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,
    ){
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        if(this.isProd) {
            throw new UnauthorizedException('We can\'t run seed on Producction')
        }
        
        await this.clearDatabase();
        const users = await this.loadUsers();
        const items = await this.loadItems(users);
        const lists = await this.loadLists(users);
        const listItems = await this.loadListItems(lists, items);
        
        return true;
    }

    private async clearDatabase() {
        await this.listItemsRepository.createQueryBuilder().delete().where({}).execute();
        await this.listRepository.createQueryBuilder().delete().where({}).execute();
        await this.itemsRepository.createQueryBuilder().delete().where({}).execute();
        await this.usersRepository.createQueryBuilder().delete().where({}).execute();
    }

    private async loadUsers(): Promise<User[]> {
        const promisesUsers = [];
        for(const user of SEED_USERS) {
            promisesUsers.push(this.usersService.create(user))
        }
        return Promise.all(promisesUsers);
    }

    private async loadItems(users: User[]): Promise<Item[]> {
        const promisesItems: Promise<Item>[] = []; 
        for(const item of SEED_ITEMS) {
            const randomUser = users[ Math.floor(Math.random() * users.length) ];
            promisesItems.push(this.itemsService.create(item, randomUser))
        }
        
        return Promise.all(promisesItems);
    }
    
    private async loadLists(users: User[]): Promise<List[]> {
        const promisesLists: Promise<List>[] = [];
        for(const list of SEED_LIST) {
            const randomUser = users[ Math.floor(Math.random() * users.length) ];
            promisesLists.push(this.listsService.create(list, randomUser));
        }
        return Promise.all(promisesLists);
    }

    private async loadListItems(lists: List[], items: Item[]): Promise<ListItem[]> {
        const promisesListItems: Promise<ListItem>[] = [];
        for(const item of items) {
            const randomList = lists[ Math.floor(Math.random() * lists.length) ];
            const listId = randomList.id, itemId = item.id;
            const quantity = Math.floor(Math.random() * 20) + 1;
            promisesListItems.push(this.listItemsService.create({ 
                itemId, 
                listId,
                quantity, 
                completed: Boolean(Math.floor(Math.random() * 2)) 
            }))
        }
        
        return Promise.all(promisesListItems);
    }
}
