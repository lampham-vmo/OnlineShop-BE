import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
} from './dto/payment-method.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiResponseWithArrayModel,
  ApiResponseWithModel,
} from 'src/common/decorators/swagger.decorator';
import { PaymentMethodService } from './payment-method.service';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { EStatusPaymentMethod } from './entities/payment-method.entity';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @RouteName('CREATE_PAYMENT_METHOD')
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiResponseWithModel(PaymentMethodResponseDto, 201)
  async create(@Body() dto: CreatePaymentMethodDto) {
    const response = await this.paymentMethodService.create(dto);
    return new APIResponseDTO<PaymentMethodResponseDto>(
      true,
      HttpStatus.CREATED,
      response,
    );
  }

  @Get()
  @RouteName('GET_ALL_PAYMENT_METHOD')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponseWithArrayModel(PaymentMethodResponseDto)
  async findAll() {
    const response = await this.paymentMethodService.findAll();
    return new APIResponseDTO<PaymentMethodResponseDto[]>(
      true,
      HttpStatus.OK,
      response,
    );
  }

  @Patch(':id/:status')
  @RouteName('CHANGE_STATUS_PAYMENT_METHOD')
  @ApiResponseWithModel(PaymentMethodResponseDto)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
  async changeStatus(
    @Param('id') id: string,
    @Param('status') status: EStatusPaymentMethod,
  ) {
    const response = await this.paymentMethodService.updateStatus(+id, status);
    return new APIResponseDTO<PaymentMethodResponseDto>(
      true,
      HttpStatus.OK,
      response,
    );
  }
}
