import { ApiProperty, PickType } from '@nestjs/swagger';

import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Permission } from 'src/modules/permission/entities/permission.entity';

// export class RoleListResponseDto extends PickType(APIResponseDTO, ['success', 'statusCode', 'data'] as const) {
//   @ApiProperty({ type: [Role] }) // chỉ rõ đây là mảng Role
//   data: Role[];
// }

export class SignUpResponseDto extends PickType(APIResponseDTO, [
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
export class LoginResultDTO {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type: [Permission] })
  permission: Permission[];
  constructor(
    accessToken: string,
    refreshToken: string,
    permission: Permission[],
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.permission = permission;
  }
}
export class AccessTokenDTO extends PickType(LoginResultDTO, [
  'accessToken',
] as const) {
  constructor(accessToken: string) {
    super();
    this.accessToken = accessToken;
  }
}
export class LogInResponseDTO extends PickType(APIResponseDTO, [
  'success',
  'data',
  'statusCode',
] as const) {
  @ApiProperty({ type: LoginResultDTO })
  data: LoginResultDTO;
  constructor(success: boolean, statusCode: number, data: LoginResultDTO) {
    super(); // gọi constructor cha, nếu cần
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
}
export class RefreshAccessTokenResponseDTO extends PickType(APIResponseDTO, [
  'success',
  'data',
  'statusCode',
] as const) {
  @ApiProperty({ type: AccessTokenDTO })
  data: AccessTokenDTO;
  constructor(success: boolean, statusCode: number, data: AccessTokenDTO) {
    super(); // gọi constructor cha, nếu cần
    this.success = success;
    this.statusCode = statusCode;
    this.data = data;
  }
}
// export class UpdateRoleResponseDto extends PickType(AddRoleResponseDto, ['success', 'data', 'statusCode'] as const){}
