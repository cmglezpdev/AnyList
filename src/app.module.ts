import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ApolloDriverConfig, ApolloDriver, ApolloDriverAsyncConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { JwtPayload } from './auth/auth.types';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()]
    // }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req }) => {
            //* Valid that you have a valid token(you are logged) for you can to use the graphql endpoints
            // TODO: Create a restful api to signIn and signUp because using this validation we don't have access to the signIn graphql endpoint
            
             // const token = req.headers.authorization?.replace('Bearer ', '');
            // if(!token) throw new Error('Token needed');
            
            // const payload = jwtService.decode(token);
            // if(!payload) throw new Error('Token not valid');
          }
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
