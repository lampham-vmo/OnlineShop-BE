import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class UpdateUserRoleDTO extends PickType(User, ['role_id']) {}

export class UpdateProfileDTO extends PickType(User, [
  'address',
  'email',
  'fullname',
  'phone',
] as const) {}
