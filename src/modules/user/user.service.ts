import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';


import { LoginUserDTO } from '../auth/auth/dto/login-user.dto';
import { SignupResponseDTO } from '../auth/auth/dto/signup-response.dto';
import { CreateUserDTO } from '../auth/auth/dto/create-user.dto';

import { hashedPasword } from 'src/common/util/bcrypt.util';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find()
    }

    async findOneById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id: id })
    }

    async findOneByEmail(email: string){
        return await this.usersRepository.findOneBy({email: email})
    }

    async findOneByEmailAndPassword(loggedInUser: LoginUserDTO): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email: loggedInUser.email, password: loggedInUser.password })
    }

    async isEmailExist(email: string): Promise<Boolean> {
        return await this.usersRepository.findOneBy({ email: email }) !== null ? true : false
    }

    async isPhoneExist(phone: string): Promise<Boolean> {
        return await this.usersRepository.findOneBy({ phone: phone }) !== null ? true : false
    }

    async isAddressExist(address: string): Promise<Boolean> {
        return await this.usersRepository.findOneBy({ address: address }) !== null ? true : false
    }

    

    async updateRefreshToken(id : number, refreshToken: string) : Promise<UpdateResult>{
        return await this.usersRepository.update({id},{refreshToken})
    }


   
    // async update(updatedUserID: number, updatedUserDTO: UserSignupDTO) : Promise<User | null> {
    //     const temp = this.usersRepository.create(updatedUserDTO)
    //     await this.usersRepository.update({id: updatedUserID},temp)
    //     return this.findOneById(temp.id)
    // }
    async createUser(newUser: CreateUserDTO) {
        //hash password before create
        const hashedPassword = await hashedPasword(newUser.password)
        const temp = this.usersRepository.create({...newUser, password: hashedPassword})
        await this.usersRepository.save(temp)
    }

    async delete(deletedUserID: number): Promise<void> {
        await this.usersRepository.delete({ id: deletedUserID })
    }
}