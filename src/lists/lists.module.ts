import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListItemModule } from '../list-item/list-item.module';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { List } from './entities/list.entity';

@Module({
  providers: [ListsResolver, ListsService],
  exports: [ListsService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([ List ]),
    ListItemModule
  ]
})
export class ListsModule {}
