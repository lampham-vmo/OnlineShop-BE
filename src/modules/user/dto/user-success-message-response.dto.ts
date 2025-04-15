import { ApiProperty } from '@nestjs/swagger';

export class UserSuccessMessageResponseDTO {
  @ApiProperty({
    example: 'User role updated successfully',
    description: 'A message confirming the operation success',
  })
  message: string;
}
