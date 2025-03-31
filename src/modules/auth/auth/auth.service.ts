import { BadRequestException, HttpCode, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { generateKeyPairSync } from 'crypto';
import { CreateUserDTO } from './dto/create-user.dto';
import { SignupResponseDTO } from './dto/signup-response.dto';
import { SignInResponseDTO } from './dto/login-response-dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

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

    async handleRefreshAccessToken(refreshToken: string) {
        try{
            const {id, email, role} = await this.jwtService.verifyAsync(
                refreshToken,
                {
                    algorithms: ['RS256'],
                    publicKey: process.env.JWT_PUBLIC_KEY
                }
            );
            const payload = {id, email, role}
            //if not throw error (validate success), create accesstoken 
    
            const accessToken = this.jwtService.sign(payload, {
                algorithm: 'RS256',
                privateKey: process.env.JWT_PRIVATE_KEY,
                expiresIn: '30m',
            });
    
            return accessToken
        }catch(err){
            throw new UnauthorizedException(err)
        }
        

    }

    async signIn({ email, password }): Promise<SignInResponseDTO | BadRequestException> {
        //check if email exists
        const isEmailExists = await this.usersService.isEmailExist(email)
        //if not exists, throw bad request
        if (!isEmailExists) throw new BadRequestException('email not found!')
        //else, check password
        const user = await this.usersService.findOneByEmailAndPassword({ email: email, password: password })
      
        if (!user) throw new BadRequestException('password not match!')
        //get payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role_id
        }
        //sign payload with private key
        console.log(payload);
        const accessToken = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '30s',
        });
        const refreshToken = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '2m',
        });

      
        //save refreshToken for User
        await this.usersService.updateRefreshToken(payload.id, refreshToken)
        const loginResponse = new SignInResponseDTO(true, HttpStatus.CREATED, accessToken, refreshToken);
        
        return loginResponse



    }

    //sign up


     async signup(newUser: CreateUserDTO): Promise<SignupResponseDTO | BadRequestException> {
            const isEmailExist = await this.usersService.isEmailExist(newUser.email)
            const isPhoneExist = await this.usersService.isPhoneExist(newUser.phone)
            if (isEmailExist) {
                throw new BadRequestException({message:"The email has already existed"})
            }else if (isPhoneExist){
                throw new BadRequestException({message:"The phone has already existed"})
            }else if (newUser.password !== newUser.confirmPassword) {
                throw new BadRequestException({message: "The confirm password must match the password"})
            } else {
                this.usersService.createUser(newUser)
                const signupResponse = new SignupResponseDTO()
                signupResponse.success = true
                signupResponse.statusCode = 201
                signupResponse.message = "Registered successfullly"
                return signupResponse
            }
        }

}
