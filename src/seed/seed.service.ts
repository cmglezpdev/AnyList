import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

import { SEED_USERS, SEED_ITEMS } from './data/seed-data'; 

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
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
        
        return true;
    }


    private async clearDatabase() {
        this.itemsRepository.createQueryBuilder().delete().where({}).execute();
        this.usersRepository.createQueryBuilder().delete().where({}).execute();
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
}
