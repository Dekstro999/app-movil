import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';

@InputType()
export class CreateUsuarioInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    nome: string = "";

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string = "";

    @Field()
    @IsNotEmpty()
    @MinLength(6)
    senha: string = "";
}