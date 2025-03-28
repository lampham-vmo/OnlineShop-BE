import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { generateKeyPairSync } from 'crypto';
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

    handleRefreshToken(){
        
    }

    async signIn({ email, password }) : Promise<{accessToken: string, refreshToken: string}>  {
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
            role: user.role
        }
        //sign payload with private key
        
        const accessToken = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '30m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            algorithm: 'RS256',
            privateKey: process.env.JWT_PRIVATE_KEY,
            expiresIn: '1h',
        });

        
        return {
            accessToken,
            refreshToken
        }



    }


}
