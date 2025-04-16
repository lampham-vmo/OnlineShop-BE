import { ApiProperty, PickType } from '@nestjs/swagger';

import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Role } from '../entities/role.entity';

export class RoleListResponseDto extends PickType(APIResponseDTO, [
  'success',
  'statusCode',
  'data',
] as const) {
  @ApiProperty({ type: [Role] }) // chỉ rõ đây là mảng Role
  data: Role[];
  constructor(success: boolean, statusCode: number, data: Role[]) {
    super(); // gọi constructor cha, nếu cần
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class AddRoleResponseDto extends PickType(APIResponseDTO, [
  'success',
  'data',
  'statusCode',
] as const) {
  @ApiProperty({ type: String })
  data: string;
  constructor(success: boolean, statusCode: number, data: string) {
    super(); // gọi constructor cha, nếu cần
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class UpdateRoleResponseDto extends PickType(AddRoleResponseDto, [
  'success',
  'data',
  'statusCode',
] as const) {
  constructor(success: boolean, statusCode: number, data: string) {
    super(); // gọi constructor cha, nếu cần
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
}
