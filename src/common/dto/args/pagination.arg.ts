import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

@ArgsType()
export class PaginationArgs {    
    @Field(() => Int, { nullable: true, defaultValue: 10 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit: number = 10;
    
    @Field(() => Int, { nullable: true, defaultValue: 0 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number = 0;
}