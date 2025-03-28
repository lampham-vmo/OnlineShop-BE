import { Controller, Get, Put, Post, Delete, Param, Body, ForbiddenException } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserSignupDTO } from "./dto/user-signup.dto";
import { UserLoginDTO } from "./dto/user-login.dto";
import { User } from "./entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { LoginResponseDTO } from "./dto/login-response.dto";
import { SignupResponseDTO } from "./dto/signup-response.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService : UserService) {}

    @Post("signup")
    async signup(@Body() createdUserDTO : UserSignupDTO) : Promise<SignupResponseDTO | BadRequestException>{
        return await this.userService.signup(createdUserDTO)
    }

    @Post("login")
    async login(@Body() loggedInUserDTO : UserLoginDTO) : Promise<LoginResponseDTO | BadRequestException>{
        return await this.userService.login(loggedInUserDTO)
    }

    @Get()
    async findAll() : Promise<User[]> {
        return await this.userService.findAll()
    }

    @Get(':id')
    async findOneById(@Param('id') id : string) : Promise<User | null> {
        return await this.userService.findOneById(Number(id))
    }

    @Delete(':id')
    async delete(@Param('id') id : string) : Promise<void> {
        return await this.userService.delete(Number(id))
    }
}