import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

import { LoginUserDTO } from '../auth/dto/login-user.dto';
import { CreateUserDTO } from '../auth/dto/create-user.dto';

import { comparedPassword, hashedPasword } from 'src/common/util/bcrypt.util';
import {
  UpdateProfileDTO,
  UpdateUserRoleDTO,
} from './dto/update-user-role.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { GetUserAccountDTO } from './dto/get-user-account.dto';
import { Role } from '../role/entities/role.entity';
import { OnModuleInit } from '@nestjs/common';
import { Cart } from '../cart/entities/cart.entity';
@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createDefaultUsers();
  }
  private async createDefaultUsers(): Promise<void> {
    //check if user role admin exists
    const isUserRoleAdminExist = await this.usersRepository.findOneBy({
      role_id: 1,
    });

    if (!isUserRoleAdminExist) {
      const res = await this.createUser({
        fullname: 'Admin',
        email: 'admin123@gmail.com',
        password: 'Admin123@',
        phone: '1234567890',
        address: '123 Admin St',
        confirmPassword: 'Admin123@',
        role_id: 1,
      });
      await this.usersRepository.update(
        {
          id: res.id,
        },
        {
          isVerified: true,
        },
      );
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }
  async updateVerifiedStatus(id: number, isVerified: boolean): Promise<void> {
    await this.usersRepository.update({ id }, { isVerified });
  }

  async getAllAccounts(): Promise<
    APIResponseDTO<{ accounts: GetUserAccountDTO[]; accountsCount: number }>
  > {
    const users = await this.usersRepository.find({
      relations: ['role'],
      where: { isDeleted: false },
    });
    const accounts: GetUserAccountDTO[] = users.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      roleName: user.role.name,
      role_id: user.role_id,
      status: user.status,
      createdAt: user.createdAt,
    }));
    return {
      success: true,
      statusCode: 200,
      data: {
        accounts: accounts,
        accountsCount: accounts.length,
      },
    };
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id: id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email: email });
  }

  async updatePasswordByEmail(
    email: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email: email });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const hashedPassword = await hashedPasword(newPassword);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    return true;
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    const isOldPasswordCorrect = await comparedPassword(
      user.password,
      oldPassword,
    );
    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Old password is incorrect!');
    }
    const hashedPassword = await hashedPasword(newPassword);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    return true;
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

  async isEmailExists(email: string): Promise<Boolean> {
    return (await this.usersRepository.findOneBy({ email: email })) !== null;
  }

  async isPhoneExists(phone: string): Promise<Boolean> {
    return (await this.usersRepository.findOneBy({ phone: phone })) !== null;
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
  async createUser(newUser: CreateUserDTO): Promise<User> {
    const hashedPassword = await hashedPasword(newUser.password);

    // Tạo user trước
    const user = this.usersRepository.create({
      ...newUser,
      password: hashedPassword,
      isDeleted: false,
      cart: { total: 0, subtotal: 0 },
    });

    await this.usersRepository.save(user);

    return user;
  }

  async delete(
    deletedUserID: number,
  ): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    const query = await this.usersRepository.findOneBy({ id: deletedUserID });
    if (query == null) {
      throw new BadRequestException('The user does not exist');
    } else {
      await this.usersRepository.update(
        { id: deletedUserID },
        { isDeleted: true },
      );
      return {
        success: true,
        statusCode: 200,
        data: { message: 'Sucessfully deleted a user' },
      };
    }
  }

  async updateRoleForUser(
    userId: number,
    updateRoleDTO: UpdateUserRoleDTO,
  ): Promise<APIResponseDTO<{ message: string }> | BadRequestException> {
    if (
      (await this.findOneById(userId)) == null ||
      (await this.usersRepository.findBy({ id: userId, isDeleted: true }))
        .length > 0
    ) {
      throw new BadRequestException('The user does not exist');
    } else if (
      (await this.roleRepository.findOneBy({ id: updateRoleDTO.role_id })) ==
      null
    ) {
      throw new BadRequestException('The role does not exist');
    } else {
      const query = await this.usersRepository.update(
        { id: userId },
        { role_id: updateRoleDTO.role_id },
      );
      if (query.affected == 0) {
        throw new BadRequestException('Cannot update a role');
      } else {
        return {
          success: true,
          statusCode: 200,
          data: { message: 'Sucessfully update a user' },
        };
      }
    }
  }

  async updateUserProfile(
    updateProfileDTO: UpdateProfileDTO,
    id: number,
  ): Promise<boolean> {
    const { address, email, fullname, phone } = updateProfileDTO;
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    //check if the email or phone already exists
    const isEmailExists = await this.usersRepository.findOneBy({
      email: email,
    });
    const isPhoneExists = await this.usersRepository.findOneBy({
      phone: phone,
    });

    if (isEmailExists && email !== user.email) {
      throw new BadRequestException('Email already exists!');
    }
    if (isPhoneExists && phone !== user.phone) {
      throw new BadRequestException('Phone already exists!');
    }
    user.address = address;
    user.email = email;
    user.fullname = fullname;
    user.phone = phone;
    await this.usersRepository.save(user);
    return true;
  }
}
