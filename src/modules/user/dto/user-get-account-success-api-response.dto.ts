// user-success-api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { GetAllAccountsResponseDTO } from './get-all-accounts-response.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';

export class GetAllAccountsFinalResponseDTO extends APIResponseDTO<GetAllAccountsResponseDTO> {
  @ApiProperty({ type: () => GetAllAccountsResponseDTO })
  data: GetAllAccountsResponseDTO = new GetAllAccountsResponseDTO();
}
