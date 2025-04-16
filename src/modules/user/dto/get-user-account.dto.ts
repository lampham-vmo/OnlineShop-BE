import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetUserAccountDTO extends PickType(User, [
  'id',
  'fullname',
  'email',
  'status',
  'createdAt',
]) {
  @ApiProperty()
  @Expose()
  readonly roleName: string;
}
