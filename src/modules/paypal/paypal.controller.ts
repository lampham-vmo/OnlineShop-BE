import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { Response } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { ApiResponseWithModel } from 'src/common/decorators/swagger.decorator';
import { CreateOrderPaypalReponseDto } from './dto/paypal.dto';

class PaypalCreateOrderDto {
  cart: any;
}

@Controller('/paypalOrders')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post()
  @ApiBody({
    type: PaypalCreateOrderDto,
  })
  @ApiResponseWithModel(CreateOrderPaypalReponseDto)
  async createOrder(@Body() body: PaypalCreateOrderDto) {
    const { cart } = body;
    const { jsonResponse, httpStatusCode } =
      await this.paypalService.createOrder(cart);
    return new APIResponseDTO<CreateOrderPaypalReponseDto>(
      true,
      httpStatusCode,
      jsonResponse,
    );
  }

  @Post(':orderID/capture')
  async captureOrder(@Param('orderID') orderID: string, @Res() res: Response) {
    try {
      const { jsonResponse, httpStatusCode } =
        await this.paypalService.captureOrder(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error('Failed to capture order:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to capture order.' });
    }
  }
}
