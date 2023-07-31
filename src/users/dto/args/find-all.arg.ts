import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray } from "class-validator";

import { ValidRoles } from "../../../auth/enums";

@ArgsType()
export class FindAllArgs {

    @Field(() => [ValidRoles], { defaultValue: [] })
    @IsArray()
    roles: ValidRoles[] = [];
}