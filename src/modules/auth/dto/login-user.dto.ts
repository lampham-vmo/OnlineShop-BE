import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';
export class LoginUserDTO extends PickType(User, [
  'email',
  'password',
] as const) {}
