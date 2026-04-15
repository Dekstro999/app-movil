import  {Injectable} from '@nestjs/common';
import {CreateUsuarioInput} from "./dto/create-usuarios.input";
import {UpdateUsuarioInput} from "./dto/update-usuarios.input";
import {PrismaService} from "../prisma/prisma.service";
import {PrismaClient} from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class UsuarioService {
//   constructor(
//     private prisma: PrismaService
//   ) {}
    constructor(private readonly  prisma: PrismaService){}
  
    async create(createUsuarioInput: CreateUsuarioInput) {
        return await this.prisma.user.create({
            data: createUsuarioInput
        });
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }

    async update(id: number, updateUsuarioInput: UpdateUsuarioInput) {
        return await this.prisma.user.update({
            where: { id },
            data: updateUsuarioInput
        });
    }

    async remove(id: number) {
        return await this.prisma.user.delete({
            where: { id }
        });
    }
}