// import {
//   IsEmail,
//   IsString,
//   MinLength,
//   MaxLength,
//   Matches,
//   IsNotEmpty,
// } from 'class-validator';

import { OmitType,PickType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

// export class GetUserDTO {
//   @IsEmail()
//   @IsNotEmpty()
//   readonly email: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(4)
//   @MaxLength(20)
//   @Matches(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     {
//       message:
//         'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
//     },
//   )
//   readonly password: string;
// }

export class GetUserDTO extends PickType(User, ['email', 'password'] as const) {}