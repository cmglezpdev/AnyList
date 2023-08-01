import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListItemResolver } from './list-item.resolver';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [
    TypeOrmModule.forFeature([ ListItem ])
  ],
  exports: [TypeOrmModule, ListItemService]
})
export class ListItemModule {}
