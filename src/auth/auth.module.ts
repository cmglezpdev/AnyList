import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { User } from '../users/entities/user.entity';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [
    UsersModule
  ]
})
export class AuthModule {}
