import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { error } from 'console';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find()
    }

    async findOneById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id: id })
    }

    async findOneByEmailAndPassword(findedUser: GetUserDTO): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email: findedUser.email, password: findedUser.password })
    }

    async isEmailExist(email: string): Promise<Boolean> {
        return await this.usersRepository.findOneBy({ email: email }) != undefined ? true : false
    }

    async create(newUser: CreateUserDTO): Promise<User | BadRequestException> {
        const isEmailExist = await this.isEmailExist(newUser.email)
        if (isEmailExist) {
            throw new BadRequestException('Email is already exist')
        } else {
            const temp = this.usersRepository.create(newUser)
            return await this.usersRepository.save(temp)
        }
    }

    //login.. 

    // async update(updatedUserID: number, updatedUserDTO: CreateUserDTO) : Promise<User | null> {
    //     const temp = this.usersRepository.create(updatedUserDTO)
    //     await this.usersRepository.update({id: updatedUserID},temp)
    //     return this.findOneById(temp.id)
    // }

    async delete(deletedUserID: number): Promise<void> {
        await this.usersRepository.delete({ id: deletedUserID })
    }
}