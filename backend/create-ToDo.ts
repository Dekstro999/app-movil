import {Field, InputType} from "type-graphql";
import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";

// Todos
@InputType()
export class CreateToDoInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    title: string = "";

    @Field()
    @IsNotEmpty()
    @IsString()
    description: string = "";

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string = "";
}   
    