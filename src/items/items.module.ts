import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

@Module({
  providers: [ItemsResolver, ItemsService],
  exports: [ItemsService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([Item])
  ]
})
export class ItemsModule {}
