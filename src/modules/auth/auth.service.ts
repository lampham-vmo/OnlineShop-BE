import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { generateKeyPairSync } from 'crypto';
import { CreateUserDTO } from './dto/create-user.dto';
import { SignupResponseDTO } from './dto/signup-response.dto';
import { SignInResponseDTO } from './dto/login-response-dto';
import { comparedPassword } from 'src/common/util/bcrypt.util';
import { LogoutResponseDTO } from './dto/logout-response.dto';
import { RefreshAtResponseDTO } from './dto/refreshAT-response.dto';

interface Payload {
    id: number;
    email: string;
    role: number
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        
    ) {
      

     }
    createKeyPair(): { privateKey: string, publicKey: string } {
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
        return { privateKey, publicKey }
    }



    async handleRefreshAccessToken({payload, refreshToken}: {payload: Payload, refreshToken: string}) : Promise<RefreshAtResponseDTO | UnauthorizedException> {
 
        
        
        //check if rt match userRT? 
        const user = await this.usersService.findOneById(payload.id)
        if (refreshToken !== user?.refreshToken) throw new UnauthorizedException('failed rt, please relogin!')


        //if not throw error (success), create accesstoken   
        const accessToken = this.jwtService.sign(payload, {
            algorithm: 'HS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '24h',
        });
        return new RefreshAtResponseDTO(true, HttpStatus.OK, 'get AT success', accessToken)



    }

    async signIn({ email, password } : {email: string, password: string}): Promise<SignInResponseDTO | BadRequestException> {
        //check if user exists
        const user = await this.usersService.findOneByEmail(email)
        //if not exists, throw bad request
        if (!user) throw new BadRequestException('user not found!')
        //else, check password

        const isValidPassword = await comparedPassword(user.password, password)
        if (!isValidPassword) throw new BadRequestException('password not match!')

        //get payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role_id
        }
        //sign payload with private key
        const accessToken = this.jwtService.sign(payload, {
            algorithm: 'HS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '24h',
        });
        const refreshToken = this.jwtService.sign(payload, {
            algorithm: 'HS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '7d',
        });


        //save refreshToken for User
        await this.usersService.updateRefreshToken(payload.id, refreshToken)
        const loginResponse = new SignInResponseDTO(true, HttpStatus.CREATED,"Login success", accessToken, refreshToken);

        return loginResponse



    }

    //sign up


    async signup(newUser: CreateUserDTO): Promise<SignupResponseDTO | BadRequestException> {
        const isEmailandPhoneExists =  await this.usersService.isEmailOrPhoneExist(newUser.email,newUser.password)
        if (isEmailandPhoneExists.emailExists) {
            throw new BadRequestException({ message: "The email has already existed" })
        } else if (isEmailandPhoneExists.phoneExists) {
            throw new BadRequestException({ message: "The phone has already existed" })
        } else if (newUser.password !== newUser.confirmPassword) {
            throw new BadRequestException({ message: "The confirm password must match the password" })
        } else {
            this.usersService.createUser(newUser)
            const signupResponse = new SignupResponseDTO(true, 201, "Registered successfully")
            return signupResponse
        }
    }

    async logout(id: number): Promise<LogoutResponseDTO>{
        //set refreshToken to empty in Backend
        await this.usersService.updateRefreshToken(id, 'empty')
        //throw at into a blacklist
        //....
        return new LogoutResponseDTO(true, HttpStatus.OK, 'Logout success')
        //delete both AT and RT in frontend

    }


}
