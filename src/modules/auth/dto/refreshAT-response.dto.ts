import { IsNotEmpty, IsString } from 'class-validator';
import { BaseResponseDTO } from './base-response.dto';

export class RefreshAtResponseDTO extends BaseResponseDTO {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    accessToken: string,
  ) {
    super(success, statusCode, message);
    this.accessToken = accessToken;
  }
}
