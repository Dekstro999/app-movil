import {Field , InputType, Int, PartialType} from '@nestjs/graphql';
import {IsInt, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";
import {CreateUsuarioInput} from "./create-usuarios.input";

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {
    @Field(() => Int)
    @IsInt()
    @IsNotEmpty()
    id: number = 0;
}