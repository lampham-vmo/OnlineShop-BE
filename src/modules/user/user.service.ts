import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

import { LoginUserDTO } from '../auth/dto/login-user.dto';
import { CreateUserDTO } from '../auth/dto/create-user.dto';

import { hashedPasword } from 'src/common/util/bcrypt.util';
import { AccountsRO } from './user.interface';
import { AccountData } from './user.interface';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getAllAccounts(): Promise<AccountsRO> {
    const users = await this.usersRepository.find({relations: ["role"]})
    const accounts: AccountData[] = users.map((user)=> ({
      id: user.id,
      fullName: user.fullname,
      email: user.email,
      role: user.role.name,
      status: user.status,
      createdAt: user.createdAt
    }))
    return {
      accounts: accounts,
      accountsCount: accounts.length
    }
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async findOneByEmailAndPassword(
    loggedInUser: LoginUserDTO,
  ): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      email: loggedInUser.email,
      password: loggedInUser.password,
    });
  }

  async isEmailOrPhoneExist(
    email: string,
    phone: string,
  ): Promise<{ emailExists: boolean; phoneExists: boolean }> {
    const user = await this.usersRepository.findOne({
      where: [{ email }, { phone }],
    });
    return {
      emailExists: user?.email == email,
      phoneExists: user?.phone == phone,
    };
  }

  async isAddressExist(address: string): Promise<Boolean> {
    return (await this.usersRepository.findOneBy({ address: address })) !== null
      ? true
      : false;
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update({ id }, { refreshToken });
  }

  // async update(updatedUserID: number, updatedUserDTO: UserSignupDTO) : Promise<User | null> {
  //     const temp = this.usersRepository.create(updatedUserDTO)
  //     await this.usersRepository.update({id: updatedUserID},temp)
  //     return this.findOneById(temp.id)
  // }
  async createUser(newUser: CreateUserDTO) {
    //hash password before create
    const hashedPassword = await hashedPasword(newUser.password);
    const temp = this.usersRepository.create({
      ...newUser,
      password: hashedPassword,
    });
    await this.usersRepository.save(temp);
  }

  async delete(deletedUserID: number): Promise<void> {
await this.usersRepository.delete({ id: deletedUserID });
  }
}