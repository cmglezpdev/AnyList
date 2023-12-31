import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AuthService } from "../auth.service";
import { User } from "../../users/entities/user.entity";
import { JwtPayload } from "../auth.types.d";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.authService.validateUser(id);
        return user;
    }
}