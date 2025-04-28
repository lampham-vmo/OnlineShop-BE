import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartProductDTO,
  ChangeCartProductDTO,
  GetCartFinalResponseDTO,
} from './dto/cart.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Cart } from './entities/cart.entity';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UserSuccessMessageFinalResponseDTO } from '../user/dto/user-success-api-response.dto';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for add to cart',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Add product to cart')
  async addToCart(
    @Req() req: Request,
    @Body() addToCartProductDTO: AddToCartProductDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.addProductToCart(
      Number(req.user?.id),
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

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Get all product in a cart',
    type: GetCartFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Get all product to cart')
  async getCart(
    @Req() req: Request,
  ): Promise<APIResponseDTO<Cart> | BadRequestException> {
    const result = await this.cartService.getAllInCart(Number(req.user!.id));
    if (!result) {
      throw new BadRequestException('Can not get a cart');
    }
    return {
      statusCode: 200,
      success: true,
      data: result,
    };
  }

  @Patch('increase')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for increase quantity',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Increase product quantity in a cart')
  async increaseQuantity(
    @Req() req: Request,
    @Body() req2: ChangeCartProductDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.increaseQuantityById(
      Number(req.user!.id),
      Number(req2.id),
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

  @Patch('decrease')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for decrease quantity',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Decrease product quantity in a cart')
  async decreaseQuantity(
    @Req() req: Request,
    @Body() req2: ChangeCartProductDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.decreaseQuantityById(
      Number(req.user!.id),
      Number(req2.id),
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

  @Delete('delete')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message for delete in cart',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Delete a product in cart')
  async deleteCart(
    @Body() req2: ChangeCartProductDTO,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const result = await this.cartService.deleteCartProductById(
      Number(req2.id),
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

  // TODO: clear cart
  @Delete('clear-cart')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Success message when clearing a cart',
    type: UserSuccessMessageFinalResponseDTO,
  })
  @ApiBearerAuth()
  @RouteName('Clear the whole cart')
  async clearCart(
    @Req() req: Request,
  ): Promise<APIResponseDTO<{ message: string }>> {
    const userId = Number(req.user!.id);
    const isDeleted = await this.cartService.clearAllInCart(userId);
    if (isDeleted) {
      return {
        statusCode: 200,
        success: true,
        data: { message: `The cart for user ${userId} has been cleared.` },
      };
    } else {
      return {
        statusCode: 400,
        success: false,
        data: { message: `The cart for user ${userId} not found.` },
      };
    }
  }
}
