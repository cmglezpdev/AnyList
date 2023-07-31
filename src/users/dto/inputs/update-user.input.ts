import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsUUID } from "class-validator";

import { CreateUserInput } from "./create-user.input";
import { ValidRoles } from "src/auth/enums";


@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @IsUUID()
    @Field(() => ID)
    id: string;

    @IsArray()
    @IsOptional()
    @Field(() => [ValidRoles], { nullable: true })
    roles?: ValidRoles[];

    @IsBoolean()
    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    isActive?: boolean;
}