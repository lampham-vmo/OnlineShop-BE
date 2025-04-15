import { ApiProperty } from '@nestjs/swagger';
import { GetUserAccountDTO } from './get-user-account.dto';

export class GetAllAccountsResponseDTO {
  @ApiProperty({ type: [GetUserAccountDTO] })
  accounts: GetUserAccountDTO[];

  @ApiProperty({ type: Number })
  accountsCount: number;
}
