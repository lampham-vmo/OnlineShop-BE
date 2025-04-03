import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty,
  } from 'class-validator';
import { Match } from 'src/common/decorators/match-custom-class-validator';



export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    readonly fullname: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'})
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Match('password', {message: 'Confirm password must match password'})
    readonly confirmPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(11)
    @Matches(/^\d+$/, {message: 'Phone number must be number only'})
    readonly phone: string;

    @IsString()
    @MinLength(1)
    @MaxLength(20)
    readonly address: string;
}