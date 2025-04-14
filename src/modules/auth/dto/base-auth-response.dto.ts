import { ApiProperty, PickType } from '@nestjs/swagger';

import { APIResponseDTO } from 'src/common/dto/response-dto';

// export class RoleListResponseDto extends PickType(APIResponseDTO, ['success', 'statusCode', 'data'] as const) {
//   @ApiProperty({ type: [Role] }) // chỉ rõ đây là mảng Role
//   data: Role[];
// }


export class SignUpResponseDto extends PickType(APIResponseDTO, ['success', 'data', 'statusCode'] as const){
    @ApiProperty({type: String})
    data: string;
    constructor(success: boolean, statusCode: number, data: string) {
        super(); // gọi constructor cha, nếu cần
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
      }
}
export class TokenDTO {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
    constructor(accessToken: string, refreshToken: string){
        this.accessToken = accessToken;
        this.refreshToken = refreshToken
    }
}
export class AccessTokenDTO extends PickType(TokenDTO, ['accessToken'] as const){
    constructor(accessToken: string){
        super()
        this.accessToken = accessToken;
    }
}
export class LogInResponseDTO extends PickType(APIResponseDTO,['success', 'data', 'statusCode'] as const){
    @ApiProperty({type: TokenDTO})
    data: TokenDTO;
    constructor(success: boolean, statusCode: number, data: TokenDTO) {
        super(); // gọi constructor cha, nếu cần
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
      }
}
export class RefreshAccessTokenResponseDTO extends PickType(APIResponseDTO, ['success', 'data', 'statusCode'] as const){
    @ApiProperty({type: AccessTokenDTO})
    data: AccessTokenDTO
    constructor(success: boolean, statusCode: number, data: AccessTokenDTO) {
        super(); // gọi constructor cha, nếu cần
        this.success = success;
        this.statusCode = statusCode;
        this.data = data;
      }
}
// export class UpdateRoleResponseDto extends PickType(AddRoleResponseDto, ['success', 'data', 'statusCode'] as const){}
