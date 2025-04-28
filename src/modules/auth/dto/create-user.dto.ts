import { PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Match } from 'src/common/decorators/match-custom-class-validator';
import { User } from 'src/modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO extends PickType(User, [
  'fullname',
  'email',
  'password',
  'phone',
  'address',
] as const) {
  @ApiProperty({
    type: 'string',
    example: 'StrongP@ssw0rd!',
    description: 'Confirm password must match password',
    minLength: 8,
    maxLength: 20,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: 'Confirm password must match password' })
  readonly confirmPassword: string;

  role_id: number = 2;
}

export class VerifyEmailDTO extends PickType(User, ['email'] as const) {}
