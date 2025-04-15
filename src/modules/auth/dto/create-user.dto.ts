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

export class CreateUserDTO extends PickType(User, ['fullname', 'email', 'password', 'phone', 'address'] as const) {

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Match('password', { message: 'Confirm password must match password' })
  readonly confirmPassword: string;

}
