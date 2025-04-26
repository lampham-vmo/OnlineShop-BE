import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Order } from '../../entities/order.entity';
import { PaginationDTO } from 'src/modules/product/DTO/response/pagination.response';
import { PaymentMethod } from 'src/modules/payment-method/entities/payment-method.entity';

export class OrderResponseDTO extends OmitType(Order, ['updatedAt', 'user']) {}

export class OrderPagingDTO {
  @ApiProperty({ type: [OrderResponseDTO] })
  order: OrderResponseDTO[];

  @ApiProperty({ type: PaginationDTO })
  pagination: PaginationDTO;

  constructor(order: OrderResponseDTO[], pagination: PaginationDTO) {
    this.order = order;
    this.pagination = pagination;
  }
}
