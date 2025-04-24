import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartProductDTO, GetCartFinalResponseDTO } from './dto/cart.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { ApiResponseWithModel } from 'src/common/decorators/swagger.decorator';
import { CartProduct } from './entities/cart_product.entity';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Cart } from './entities/cart.entity';
import { GlobalExceptionFilter } from 'src/common/exceptions/global-exception.filter';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UserSuccessMessageFinalResponseDTO } from '../user/dto/user-success-api-response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // @UseGuards(AuthGuard)
  @Post("add")
  @ApiOkResponse({
    description: 'Success message for add to cart',
    type: UserSuccessMessageFinalResponseDTO,
  })
  async addToCart(
    @Body() addToCartProductDTO: AddToCartProductDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.addProductToCart(
      addToCartProductDTO.userId,
      addToCartProductDTO.productId,
      addToCartProductDTO.quantity,
    );
    if (!result) {
      return {
        statusCode: 400,
        success: false,
        data: { message: 'Can not add to cart' },
      };
    }
    return {
      statusCode: 200,
      success: true,
      data: { message: 'Sucessfully add to cart' },
    };
  }

  @Get("all")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Get all product in a cart',
    type: GetCartFinalResponseDTO,
  })
  @RouteName('Get all product to cart')
  async getCart(
    @Body() req: { userId: string },
  ): Promise<APIResponseDTO<Cart> | BadRequestException> {
    const result = await this.cartService.getAllInCart(Number(req.userId));
    if (!result) {
      throw new BadRequestException('Can not get a cart');
    }
    return {
      statusCode: 200,
      success: true,
      data: result,
    };
  }

  @Patch("add/quantity")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for increase quantity',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @RouteName('Increase product quantity in a cart')
  async increaseQuantity(
    @Body() req: { userId: string; productId: string },
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.increaseQuantityById(
      Number(req.userId),
      Number(req.productId),
    );
    if (!result) {
      return {
        statusCode: 400,
        success: false,
        data: { message: 'Can not increase' },
      };
    } else {
      return {
        statusCode: 200,
        success: true,
        data: { message: 'Sucessfully increase the quantity' },
      };
    }
  }

  @Patch("decrease/quatity")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for decrease quantity',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @RouteName('Decrease product quantity in a cart')
  async decreaseQuantity(
    @Body() req: { userId: string; productId: string },
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.decreaseQuantityById(
      Number(req.userId),
      Number(req.productId),
    );
    if (!result) {
      return {
        statusCode: 400,
        success: false,
        data: { message: 'Can not decrease' },
      };
    } else {
      return {
        statusCode: 200,
        success: true,
        data: { message: 'Sucessfully decrease the quantity' },
      };
    }
  }

  @Delete("delete")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for delete in cart',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @RouteName('Delete a product in cart')
  async deleteCart(
    @Body() req: { productId: string },
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.deleteCartProductById(
      Number(req.productId),
    );
    if (!result) {
      return {
        statusCode: 400,
        success: false,
        data: { message: 'Can not delete in cart' },
      };
    }
    return {
      statusCode: 200,
      success: true,
      data: { message: 'Sucessfully delete in cart' },
    };
  }
}
