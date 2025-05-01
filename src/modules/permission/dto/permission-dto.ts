import { ApiProperty, PickType } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';

export class PermissionDTO {
  @ApiProperty({ type: Number })
  id: number;
  @ApiProperty({ type: String })
  name: string; //name permission

  @ApiProperty({ type: String })
  path: string; // path permission

  @ApiProperty({ type: String })
  method: string; // method permission
}
