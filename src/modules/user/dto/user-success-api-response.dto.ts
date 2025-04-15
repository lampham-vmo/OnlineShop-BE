// user-success-api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserSuccessMessageResponseDTO } from './user-success-message-response.dto';

export class UserSuccessAPIResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: () => UserSuccessMessageResponseDTO })
  data: UserSuccessMessageResponseDTO;
}
