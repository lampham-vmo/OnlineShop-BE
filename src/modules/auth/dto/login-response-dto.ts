import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseResponseDTO } from './base-response.dto';

export class SignInResponseDTO extends BaseResponseDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    accessToken: string,
    refreshToken: string,
  ) {
    super(success, statusCode, message);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
