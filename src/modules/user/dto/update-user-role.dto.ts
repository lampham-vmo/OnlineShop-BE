import { ApiProperty, PickType } from '@nestjs/swagger';
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

export class UpdatePasswordDTO extends PickType(User, ['password'] as const) {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'old password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @ApiProperty({
    type: 'string',
    example: 'StrongP@ssw0rd!',
    description:
      'oldpassword must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    minLength: 8,
    maxLength: 20,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'confirmPassword must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @ApiProperty({
    type: 'string',
    example: 'StrongP@ssw0rd!',
    description:
      'confirmPassword must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    minLength: 8,
    maxLength: 20,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  confirmPassword: string;
}

export class ForgetPassworDTO extends PickType(UpdatePasswordDTO, [
  'password',
  'confirmPassword',
] as const) {}
