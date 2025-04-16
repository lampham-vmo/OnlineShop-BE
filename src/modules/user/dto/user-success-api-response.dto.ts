// user-success-api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserSuccessMessageResponseDTO } from './user-success-message-response.dto';
import { APIResponseDTO } from 'src/common/dto/response-dto';

export class UserSuccessMessageFinalResponseDTO extends APIResponseDTO<UserSuccessMessageResponseDTO> {
  @ApiProperty({ type: () => UserSuccessMessageResponseDTO })
  data: UserSuccessMessageResponseDTO = new UserSuccessMessageResponseDTO();
}
