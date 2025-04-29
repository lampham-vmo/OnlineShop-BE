import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { generateKeyPairSync } from 'crypto';
import { CreateUserDTO } from './dto/create-user.dto';
import { comparedPassword } from 'src/common/util/bcrypt.util';
import { LogoutResponseDTO } from './dto/logout-response.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { RoleService } from '../role/role.service';
import { Permission } from '../permission/entities/permission.entity';
import { EmailService } from '../email/email.service';
import { Email } from 'src/common/types/type';
interface Payload {
  id: number;
  email: string;
  role: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
    private emailService: EmailService,
  ) {}

  createKeyPair(): { privateKey: string; publicKey: string } {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    return { privateKey, publicKey };
  }

  async handleRefreshAccessToken({
    payload,
    refreshToken,
  }: {
    payload: Payload;
    refreshToken: string;
  }): Promise<string> {
    //check if rt match userRT?
    const user = await this.usersService.findOneById(payload.id);
    if (refreshToken !== user?.refreshToken)
      throw new UnauthorizedException('failed rt, please relogin!');

    //if not throw error (success), create accesstoken
    const accessToken = this.createJwtFromPayload(payload, '1d');

    return accessToken;
  }

  createJwtFromPayload(payload: any, expiredIn: string): string {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: process.env.JWT_PRIVATE_KEY,
      expiresIn: expiredIn,
    });
  }

  async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    accessToken: string;
    refreshToken: string;
    permission: Permission[];
  }> {
    //check if user exists
    const user = await this.usersService.findOneByEmail(email);
    //if not exists, throw bad request
    if (!user) throw new BadRequestException('user not found!');
    //else, check password

    const isValidPassword = await comparedPassword(user.password, password);
    if (!isValidPassword) throw new BadRequestException('password not match!');
    //const check if email activate or not
    if (!user.isVerified) throw new BadRequestException('email not verified!');
    //get payload
    let permission;
    const role = await this.roleService.getPermissionByRoleId(user.role_id);
    if (role) {
      permission = role.permissions;
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id,
    };
    //sign payload with private key
    const accessToken = this.createJwtFromPayload(payload, '1d');
    const refreshToken = this.createJwtFromPayload(payload, '7d');

    //save refreshToken for User
    await this.usersService.updateRefreshToken(payload.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      permission,
    };
  }
  //resend confirm email
  async resendConfirmEmail(email: string): Promise<boolean> {
    //check if email exists in DB
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Email not found!');
    //create token
    const confirmEmailToken = this.createJwtFromPayload({ email: email }, '1d');
    //send email to user
    await this.emailService.sendConfirmationEmail(email, confirmEmailToken);
    return true;
  }
  //confirm email for sign up
  async confirmEmail(token: string): Promise<boolean> {
    let payload: Email;
    try {
      payload = this.jwtService.verify(token, {
        publicKey: process.env.JWT_PUBLIC_KEY,
        algorithms: ['RS256'],
      });
    } catch (err) {
      throw new BadRequestException('Invalid token!');
    }
    if (!payload) throw new BadRequestException('invalid payload!');
    //not throw error => token is valid
    const { email }: { email: string } = payload;
    //check if email exists in DB
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Email not found!');
    //if email not verified => verified
    if (user.isVerified === false) {
      await this.usersService.updateVerifiedStatus(user.id, true);
    }
    return true;
  }

  //1. send email to server, server will take this email and create a token link and a password
  //2. if user click con the link, gmail will redirect to front end
  //3. frontend then send request to backend with token
  //4. backend will decode token to take payload that contain email and password
  //5. backend will update password for this email with new password

  async sendResetPasswordEmail(email: string): Promise<boolean> {
    //check if email exists in DB
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Email not found!');
    //create token
    const resetPasswordToken = this.createJwtFromPayload(
      { email: email },
      '10m',
    );
    //send email to user
    await this.emailService.sendResetPasswordEmail(email, resetPasswordToken);
    return true;
  }

  async confirmResetPasswordToken(
    token: string,
    newPassword: string,
  ): Promise<boolean> {
    let payload: Email;
    try {
      payload = this.jwtService.verify(token, {
        publicKey: process.env.JWT_PUBLIC_KEY,
        algorithms: ['RS256'],
      });
    } catch (err) {
      throw new BadRequestException('Invalid token!');
    }
    if (!payload) throw new BadRequestException('invalid payload!');
    return await this.usersService.updatePasswordByEmail(
      payload.email,
      newPassword,
    );
  }

  //send email to reset password
  // async sendResetPasswordEmail(email: string, id: number): Promise<boolean> {
  //   //check if email exists in DB
  //   try{
  //     console.log('hello');
  //     const user = await this.usersService.findOneById(id);
  //     if (!user) throw new BadRequestException('User not found!')
  //     if(user.email !== email) throw new BadRequestException('Not your email!')
  //     //create password
  //     const newResetPassword = generateStrongPassword(16)
  //     console.log(newResetPassword);
  //     await this.usersService.updatePasswordByEmail(email, newResetPassword)
  //     //send email to user
  //     await this.emailService.sendResetPasswordEmail(email, newResetPassword)
  //     return true
  //   }catch(err){
  //     console.log(err);
  //   }
  //   return false

  // }

  //sign up
  async signup(
    newUser: CreateUserDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    try {
      if (await this.usersService.isEmailExists(newUser.email)) {
        throw new BadRequestException({
          message: 'The email has already existed',
        });
      } else if (await this.usersService.isPhoneExists(newUser.phone)) {
        throw new BadRequestException({
          message: 'The phone has already existed',
        });
      } else if (newUser.password !== newUser.confirmPassword) {
        throw new BadRequestException({
          message: 'The confirm password must match the password',
        });
      } else {
        //create user with isVerified = false
        await this.usersService.createUser(newUser);

        //send email confirm to user
        const confirmEmailToken = this.createJwtFromPayload(
          { email: newUser.email },
          '1d',
        );

        await this.emailService.sendConfirmationEmail(
          newUser.email,
          confirmEmailToken,
        );

        return {
          success: true,
          statusCode: 200,
          data: { message: 'Successfully created a user' },
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async logout(id: number): Promise<LogoutResponseDTO> {
    //set refreshToken to empty in Backend
    await this.usersService.updateRefreshToken(id, 'empty');
    //throw at into a blacklist
    //....
    return new LogoutResponseDTO(true, HttpStatus.OK, 'Logout success');
    //delete both AT and RT in frontend
  }
}
