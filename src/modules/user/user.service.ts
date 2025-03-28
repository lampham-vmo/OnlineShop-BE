import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignupDTO } from './dto/user-signup.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { LoginResponseDTO } from './dto/login-response.dto';
import { SignupResponseDTO } from './dto/signup-response.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,) { }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find()
    }

    async findOneById(id: number): Promise<User | null> {
        return await this.usersRepository.findOneBy({ id: id })
    }

    async findOneByEmailAndPassword(loggedInUser: UserLoginDTO): Promise<User | null> {
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

    async signup(newUser: UserSignupDTO): Promise<SignupResponseDTO | BadRequestException> {
        const isEmailExist = await this.isEmailExist(newUser.email)
        const isPhoneExist = await this.isPhoneExist(newUser.phone)
        const isAddressExist = await this.isAddressExist(newUser.address)
        if (isEmailExist) {
            throw new BadRequestException({message:"The email has already existed"})
        }else if (isPhoneExist){
            throw new BadRequestException({message:"The phone has already existed"})
        } else if (isAddressExist){
            throw new BadRequestException({message:"The address has already existed"})
        }else if (newUser.password !== newUser.confirmPassword) {
            throw new BadRequestException({message: "The confirm password must match the password"})
        } else {
            const temp = this.usersRepository.create(newUser)
            await this.usersRepository.save(temp)
            const signupResponse = new SignupResponseDTO()
            signupResponse.success = true
            signupResponse.statusCode = 201
            signupResponse.message = "Registered successfullly"
            return signupResponse
        }
    }

    async login(currentUser : UserLoginDTO): Promise<LoginResponseDTO | BadRequestException> {
        const isEmailExist = await this.isEmailExist(currentUser.email)
        const user = await this.findOneByEmailAndPassword(currentUser)
        if(!isEmailExist){
            throw new BadRequestException({messsage: "The email has not been registered"})
        } else if (user == null) {
            throw new BadRequestException({message: "The email or password is incorrect"})
        } else {
            const loginResponse = new LoginResponseDTO()
            loginResponse.id = user.id
            loginResponse.email = user.email
            loginResponse.role_id = user.role_id
            return loginResponse
        }
    }

    // async update(updatedUserID: number, updatedUserDTO: UserSignupDTO) : Promise<User | null> {
    //     const temp = this.usersRepository.create(updatedUserDTO)
    //     await this.usersRepository.update({id: updatedUserID},temp)
    //     return this.findOneById(temp.id)
    // }

    async delete(deletedUserID: number): Promise<void> {
        await this.usersRepository.delete({ id: deletedUserID })
    }
}