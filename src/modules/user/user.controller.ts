import { Controller, Get, Put, Post, Delete, Param, Body, ForbiddenException } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { GetUserDTO } from "./dto/get-user.dto";
import { User } from "./entities/user.entity";
import { BadRequestException } from "@nestjs/common";

@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService) {}

    @Post()
    async create(@Body() createUserDTO : CreateUserDTO) : Promise<User | BadRequestException>{
        return await this.userService.create(createUserDTO)
    }

    @Get()
    async findAll() : Promise<User[]> {
        return await this.userService.findAll()
    }
}