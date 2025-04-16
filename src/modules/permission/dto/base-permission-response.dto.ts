import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Permission } from '../entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetPermissionResponseDTO extends APIResponseDTO<Permission[]> {
  @ApiProperty({ type: [Permission] })
  declare data: Permission[];
  constructor(success: boolean, statusCode: number, data: Permission[]) {
    super(success, statusCode, data);
  }
}
