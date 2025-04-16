import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}
