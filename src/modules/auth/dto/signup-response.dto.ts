import { IsString, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseResponseDTO } from './base-response.dto';

export class SignupResponseDTO extends BaseResponseDTO {
  constructor(success: boolean, statusCode: number, message: string) {
    super(success, statusCode, message);
  }
}
