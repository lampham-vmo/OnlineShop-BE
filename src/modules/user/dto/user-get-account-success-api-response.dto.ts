// user-success-api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { GetAllAccountsResponseDTO } from './get-all-accounts-response.dto';

export class UserSuccessAPIResponseDTO {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: () => GetAllAccountsResponseDTO })
  data: GetAllAccountsResponseDTO;
}
