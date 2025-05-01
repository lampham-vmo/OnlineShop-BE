import { ApiProperty, PickType } from '@nestjs/swagger';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { User } from '../entities/user.entity';

export class Profile extends PickType(User, [
  'address',
  'email',
  'fullname',
  'phone',
  'role',
] as const) {
  constructor({ address, email, fullname, phone, role }: Profile) {
    super();
    this.address = address;
    this.email = email;
    this.fullname = fullname;
    this.phone = phone;
    this.role = role;
  }
}

export class GetProfileResponseDTO extends APIResponseDTO<Profile> {
  @ApiProperty({ type: Profile })
  declare data: Profile;
  constructor(success: boolean, statusCode: number, data: Profile) {
    super(success, statusCode, data);
  }
}
