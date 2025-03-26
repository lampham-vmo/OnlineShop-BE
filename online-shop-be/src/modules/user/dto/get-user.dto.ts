import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches
  } from 'class-validator';

export class GetUserDTO {
    @IsEmail()
    readonly email: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Invalid password'})
    readonly password: string;
}