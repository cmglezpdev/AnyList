import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { User } from '../../users/entities/user.entity';
import { ValidRoles } from '../enums';


export const GetUser = createParamDecorator(
    (roles: ValidRoles[] = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user: User  = ctx.getContext().req.user;
        
        if(!user) {
            throw new InternalServerErrorException('No user inside the request - make sure that we used the AuthGuard');
        }

        const hasValidRole = user.roles.map(rol => roles.includes(rol)).some(x => x === true);
        if(roles.length === 0 || hasValidRole) return user;
        
        throw new ForbiddenException(`The user ${user.fullName} doesn't have sufficient permissions. He/She need a valid role: ${roles}`)
    }
);